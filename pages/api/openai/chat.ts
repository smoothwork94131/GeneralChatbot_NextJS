import {  NextResponse } from 'next/server';
import { OpenAIAPI } from '@/types/openai';
import { supabase } from '@/utils/app/supabase-client';
import {  NO_ACCOUNT_TIMES, FREE_TIMES, PAID_TIMES } from '@/utils/app/const';
import { supabaseAdmin } from '@/utils/app/supabase-client';
import moment from 'moment';

import {rateLimiterMiddleware} from '../middleware';

if (!process.env.OPENAI_API_KEY)
  console.warn(
    'OPENAI_API_KEY has not been provided in this deployment environment. ' +
    'Will use the optional keys incoming from the client, which is not recommended.',
  );


// helper functions

export async function extractOpenaiChatInputs(req: ApiChatInput): Promise<ApiChatInput> {

  const {
    api: userApi = {},
    model,
    messages,
    temperature = 0.5,
    max_tokens = 1024,
  } = req;

  if (!model || !messages)
    throw new Error('Missing required parameters: api, model, messages');

  const api: OpenAIAPI.Configuration = {
    apiKey: (userApi.apiKey || process.env.OPENAI_API_KEY || '').trim(),
    apiHost: (userApi.apiHost || process.env.OPENAI_API_HOST || 'api.openai.com').trim().replaceAll('https://', ''),
    apiOrganizationId: (userApi.apiOrganizationId || process.env.OPENAI_API_ORG_ID || '').trim(),
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

const getUserTimes = async (userId: string|null, fingerId: string) => {
  let times = 0;
  if(!userId) {
    const { data, error } = await supabase
    .from('free')
    .select('*')
    .eq('visitorId', fingerId)
    .order("id", { ascending: false });

    if(data) {
      if(data.length == 0) {
        times = NO_ACCOUNT_TIMES ;
        const { data, error } = await supabase
        .from('free')
        .insert([{
          times: times,
          visitorId: fingerId
        }])
      } else {
        times = data[0].times;
      }
    }
  }

  if(userId){
    const subscription = await supabase
    .from('subscriptions')
    .select('*')
    .gte('current_period_end', moment().format("YYYY-MM-D"));
    times = FREE_TIMES;
    if(subscription.data) {
      if(subscription.data?.length > 0) {
        times = PAID_TIMES;
      } 
    }
    
    const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .eq('chat_date', moment().format("MM/DD/YYYY"));

    if(data && data.length > 0) {
      times = data[0].times;
    } else {
      const { data, error } = await supabase
      .from('users')
      .update([{
        "chat_date": moment().format("MM/DD/YYYY"),
        "times": times
      }])
      .eq('id', userId);
      times = times;
    }
  }
  return times;
}

export const decreaseUserTimes = async (userId, fingerId) => {
  const userTimes = await getUserTimes(userId, fingerId);

  if(userTimes == 0) {
    return;
  }
  if(!userId) {
    const { error } = await supabaseAdmin
    .from('free')
    .update([{
      visitorId: fingerId,
      times: Number(userTimes) - 1
    }]).eq("visitorId", fingerId);
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
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq("user_id", user_id)
    .gte('current_period_end', moment().format("YYYY-MM-D"))
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


export default async function handler(req, res) {

  try {
    await rateLimiterMiddleware(req, res, async() => {
      
    });
  }catch(e) {

  }
  try{
    
      const userApi = await req.json();
      const input = userApi.input;
      const fingerId = userApi.fingerId;
      const userId = userApi.userId;
  
      const userTimes = await getUserTimes(userId, fingerId);
      const isSubscription = await getSubscriptions(userId);
  
      if(!userId && userTimes <=0) {
          return new NextResponse(`user times `, { status: 401 });
      } else {
          if(userTimes <=0 && !isSubscription) {
            return new NextResponse(`user subscription `, { status: 402 });  
          }
      }

      try {
        const { api, ...rest } = await extractOpenaiChatInputs(input);
        const payLoad = chatCompletionPayload(rest, false);
        const response = await postToOpenAI(api, '/v1/chat/completions', payLoad);
        const completion: OpenAIAPI.Chat.CompletionsResponse = await response.json();
        await decreaseUserTimes(userId, fingerId);
        return new NextResponse(JSON.stringify({
          message: completion.choices[0].message,
        } as ApiChatResponse));
  
      } catch (error: any) {
        return new NextResponse(`[Issue] ${error}`, { status: 400 });
      }
  }catch(e) {

  } 
}

// noinspection JSUnusedGlobalSymbols
export const config = {
  runtime: 'edge',
};