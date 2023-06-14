import {  NextResponse } from 'next/server';
import { OpenAIAPI } from '@/types/openai';
import { createClient } from '@supabase/supabase-js';
import {  NO_ACCOUNT_TIMES, FREE_TIMES, PAID_TIMES, OPENAI_MODELID, DEFAULT_SYSTEM_PROMPT } from '@/utils/app/const';

import moment from 'moment';

import { OPENAI_API_KEY } from '@/utils/server/const';

import { NEXT_PUBLIC_SUPABASE_URL } from '@/utils/app/const';
import { SUPABASE_SERVICE_ROLE_KEY } from '@/utils/server/const';
import { Database } from '@/types/types_db';
import { Global } from 'global';
import { ButtonPrompts, Buttons, Input, Utility, UtilityState } from '@/types/role';
import { Message, UserMessageState } from '@/types/chat';
import { useFetch } from '@/hooks/useFetch';
// Note: supabaseAdmin uses the SERVICE_ROLE_KEY which you must only use in a secure server-side context
// as it has admin priviliges and overwrites RLS policies!
const supabaseAdmin = createClient<Database>(
 NEXT_PUBLIC_SUPABASE_URL || '',
  SUPABASE_SERVICE_ROLE_KEY || ''
);

if (!process.env.OPENAI_API_KEY)
  console.warn(
    'OPENAI_API_KEY has not been provided in this deployment environment. ' +
    'Will use the optional keys incoming from the client, which is not recommended.',
);

// helper functions

export function extractOpenaiChatInputs(ApiChatInput): ApiChatInput {

  const {
    api: userApi = {},
    model,
    messages,
    temperature = 0.5,
    max_tokens = 1024,
  } = ApiChatInput;

  if (!model || !messages)
    throw new Error('Missing required parameters: api, model, messages');

  const api: OpenAIAPI.Configuration = {
    apiKey: (process.env.OPENAI_API_KEY || OPENAI_API_KEY).trim(),
    apiHost: (process.env.OPENAI_API_HOST || 'api.openai.com').trim().replaceAll('https://', ''),
    apiOrganizationId: (process.env.OPENAI_API_ORG_ID || '').trim(),
  };
  if (!api.apiKey)
    throw new Error('Missing OpenAI API Key. Add it on the client side (Settings icon) or server side (your deployment).');

  return { api, model, messages, temperature, max_tokens };
}

const openAIHeaders = (api: OpenAIAPI.Configuration): HeadersInit => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${api.apiKey}`,
  ...(api.apiOrganizationId && { 'OpenAI-Organization': api.apiOrganizationId }),
});

export const chatCompletionPayload = (input: Omit<ApiChatInput, 'api'>, stream: boolean): OpenAIAPI.Chat.CompletionsRequest => ({
  model: input.model,
  messages: input.messages,
  ...(input.temperature && { temperature: input.temperature }),
  ...(input.max_tokens && { max_tokens: input.max_tokens }),
  stream,
  n: 1,
});

export const getUserTimes = async (userId: string|null, fingerId: string) => {
  let times = 0;
  if(!userId) {
    const { data, error } = await supabaseAdmin
    .from('free')
    .select('*')
    .eq('visitor_id', fingerId)
    .order("id", { ascending: true });

    if(data) {
      if(data.length == 0) {
        times = NO_ACCOUNT_TIMES;
        const { data, error } = await supabaseAdmin
        .from('free')
        .insert([{
          times: times,
          visitor_id: fingerId
        }])
      } else {
        times = data[0].times;
      }
    }
  }

  if(userId){
    const subscription = await supabaseAdmin
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .gte('current_period_end', moment.utc().format("YYYY-MM-D"));
    times = FREE_TIMES;
    if(subscription.data) {
      if(subscription.data?.length > 0) {
        times = PAID_TIMES;
      } 
    }
    
    const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', userId)
    .eq('chat_date', moment.utc().format("MM/DD/YYYY"));

    if(data && data.length > 0) {
      times = data[0].times;
    } else {
      const { data, error } = await supabaseAdmin
      .from('users')
      .update([{
        "chat_date": moment.utc().format("MM/DD/YYYY"),
        "times": times
      }])
      .eq('id', userId);
      times = times;
    }
  }
  return times;
}

export const decreaseUserTimes = async (userId, fingerId, current_times=-1) => {
  let userTimes
  
  if(current_times === -1){
    userTimes = await getUserTimes(userId, fingerId);
  } else {
    userTimes = current_times;
  }

  if(userTimes == 0) {
    return;
  }

  if(!userId) {
    const { error } = await supabaseAdmin
    .from('free')
    .update([{
      visitor_id: fingerId,
      times: Number(userTimes) - 1
    }]).eq("visitor_id", fingerId);
    if (error) {
      console.log(error);
    }
  } else {  
    const { error } = await supabaseAdmin
    .from('users')
    .update([{
      times: Number(userTimes) - 1
    }]).eq("id", userId);
    if (error) {
      console.log(error);
    }
  }
}

async function rethrowOpenAIError(response: Response) {
  if (!response.ok) {
    let errorPayload: object | null = null;
    try {
      errorPayload = await response.json();
    } catch (e) {
      // ignore
    }
    throw new Error(`${response.status} · ${response.statusText}${errorPayload ? ' · ' + JSON.stringify(errorPayload) : ''}`);
  }
}


export async function getOpenAIJson<TJson extends object>(api: OpenAIAPI.Configuration, apiPath: string): Promise<TJson> {
  const response = await fetch(`https://${api.apiHost}${apiPath}`, {
    method: 'GET',
    headers: openAIHeaders(api),
  });
  await rethrowOpenAIError(response);
  return await response.json();
}

export const getSubscriptions = async (user_id) => {
  if(!user_id) return false;
  const { data, error } = await supabaseAdmin
    .from('subscriptions')
    .select('*')
    .eq("user_id", user_id)
    .gte('current_period_end', moment.utc().format("YYYY-MM-D"))
    .order("current_priod_end", { ascending: false });

  if(data) {
    if(data.length > 0) {
      return true;
    }
  }
  return false;
}

export async function postToOpenAI<TBody extends object>(api: OpenAIAPI.Configuration, apiPath: string, body: TBody, signal?: AbortSignal): Promise<Response> {
  const response = await fetch(`https://${api.apiHost}${apiPath}`, {
    method: 'POST',
    headers: openAIHeaders(api),
    body: JSON.stringify(body),
    signal,
  });
  await rethrowOpenAIError(response);
  return response;
}

const getUpdatedBackend = async() => {
  const { data, error } = await supabaseAdmin
    .from('updated_backend')
    .select('*')
    .eq('name', "default")

  if (error) {
    return [];
  } else {
      if(data.length > 0) {
          return data[0].json_data;
      } else {
          return [];
      }
  }
}

// I/O types for this endpoint

export interface ApiChatInput {
  api: OpenAIAPI.Configuration;
  model: string;
  messages: OpenAIAPI.Chat.Message[];
  temperature?: number;
  max_tokens?: number;
}

export interface ApiChatResponse {
  message: OpenAIAPI.Chat.Message;
}
export async function getUtilityInfo(utilityKey){
  
  if(Global.utilites_group.length == 0) {
    Global.utilites_group = await getUpdatedBackend();
  }

 

  const roleGroup_ = Global.utilites_group;
  let utilityInfo: Utility = UtilityState;

  for(let r_index = 0 ; r_index < roleGroup_.length ; r_index++) {
    for(let g_index = 0 ; g_index <roleGroup_[r_index].utilities_group.length; g_index++) {
        for(let u_index = 0 ; u_index < roleGroup_[r_index].utilities_group[g_index].utilities.length; u_index++){
          if(utilityKey == roleGroup_[r_index].utilities_group[g_index].utilities[u_index].key 
              ) {
                utilityInfo = roleGroup_[r_index].utilities_group[g_index].utilities[u_index];
          }
      }
    }
  }
  return utilityInfo;
}
let requestCounts: { [ip: string]: number } = {};

// Keep track of when each IP address last made a request
let requestLasts: { [ip: string]: number } = {};

export default async function handler(req, res) {
  
  try {
    const ip = req.headers['x-forwarded-for'];
    const now = Date.now();

    // Reset request count and timestamp when a new minute starts
    if (!requestLasts[ip] || now - requestLasts[ip] >  1000) {
      requestCounts[ip] = 0;
      requestLasts[ip] = now;
    }

    // Check if the maximum number of requests has been reached for this IP address
    if (requestCounts[ip] >= 1000) {
      throw new Error('Rate limit exceeded');
    }

    requestCounts[ip]++;

  } catch (error: any) {
    console.error(error);
    return new NextResponse(`limited`, { status: 429 });
  }
  try{
    const userApi = await req.json();
    const utilityKey = userApi.utilityKey;
    const fingerId = userApi.fingerId;
    const userId = userApi.userId;
    const responseMessages = userApi.response_messages;
    const settings = userApi.settings;
    const utilityInfo = await getUtilityInfo(utilityKey);
    const buttonPrompts = userApi.buttonPrompts;

    
    let system_prompt = Object.keys(utilityInfo).includes("system_prompt")? utilityInfo.system_prompt:DEFAULT_SYSTEM_PROMPT;
    let user_prompt = Object.keys(utilityInfo).includes("user_prompt")? utilityInfo.user_prompt:'';
    
    if(buttonPrompts && utilityInfo.buttonGroup) {
      let button_info: Buttons = {user_prompt:'', system_prompt:'', name:''};

      utilityInfo.buttonGroup.map((group) => {
        group.buttons.map(button => {
          if(group.name == buttonPrompts.group_name && button.name == buttonPrompts.button_name) {
            button_info = button;
          }
        })
      })

      system_prompt = button_info.system_prompt;
      user_prompt = button_info.user_prompt;
    }

    
    const today_datetime = new Date().toUTCString();
    let messages: Message[] = [];
    

    if(system_prompt){
      system_prompt = system_prompt.replaceAll("{{Today}}", today_datetime);
      settings.map(selectedSetting => {
        const selectedGroup = utilityInfo.buttonGroup.filter(group =>group.name == buttonPrompts.group_name);
        let prompt = '';
        if(selectedGroup.length > 0) {
          selectedGroup[0].settings.map((setting) => {
            setting.items.map((item) => {
              if(setting.name == selectedSetting.setting_name && item.name == selectedSetting.item_name) {
                prompt = item.prompt;
              }
            })
          })
        }
        system_prompt += ` ${prompt}`;
      })
      
      messages =[{role: 'system', content: system_prompt}];
    }
    
    responseMessages.map((message, message_index) => {
      if(message.role == "user") {
          let new_user_prompt = user_prompt?.slice();

          let content = message.content;
          
          const inputs = message.inputs;
          let index=0;

          inputs.map((input: Input) => {
            if(input.type == "form"){
              new_user_prompt = new_user_prompt?.replaceAll(`{${index}}`, input.value?input.value:'');
                index++;
            }
          });

          if(new_user_prompt) {
            new_user_prompt = new_user_prompt.replaceAll(`{${index}}`, `${content}`);
          }
        
          message = {
            role: 'user',
            content: new_user_prompt
          }
      }
      messages.push(message);
    
    });

    console.log(messages);

    let [userTimes, isSubscription] = await Promise.all([getUserTimes(userId, fingerId), getSubscriptions(userId)]);
    if (!userId && userTimes <= 0) {
      throw new Error("User times have expired.");
    } else if (userTimes <= 0 && !isSubscription) {
      throw new Error("User subscription required.");
    }
    
    const { api, ...rest } = extractOpenaiChatInputs({messages: messages, model: OPENAI_MODELID});
    const payLoad = chatCompletionPayload(rest, false);

    const response_ = postToOpenAI(api, "/v1/chat/completions", payLoad);
    const completion_ = response_.then((res) => res.json());
    const decreaseUser = decreaseUserTimes(userId, fingerId, userTimes);

    const [completion,_] :[OpenAIAPI.Chat.CompletionsResponse,any] = await Promise.all([completion_, decreaseUser]);
    // const completion: OpenAIAPI.Chat.CompletionsResponse = await response.json();
        
    return new NextResponse(JSON.stringify({
      message: completion.choices[0].message,
    }));

  } catch(error: any) {
    console.log("[Issue]", error);
    return new NextResponse(`[Issue] ${error.message}`, { status: 400 });
  }
}
// noinspection JSUnusedGlobalSymbols
export const config = {
  runtime: 'edge',
};