import { NextRequest, NextResponse } from 'next/server';
import { createParser } from 'eventsource-parser';

import { ApiChatInput, chatCompletionPayload, decreaseUserTimes, extractOpenaiChatInputs, getSubscriptions, getUserTimes, getUtilityInfo, postToOpenAI } from './chat';
import { OpenAIAPI } from '@/types/openai';

import { getUpdatedBackend } from '../updated_backend';
import { Global } from 'global';
import { Input, Utility, UtilityState } from '@/types/role';
import { Message, UserMessageState } from '@/types/chat';
import { DEFAULT_SYSTEM_PROMPT, OPENAI_MODELID } from '@/utils/app/const';

async function chatStreamRepeater(input: ApiChatInput, signal: AbortSignal): Promise<ReadableStream> {

  // Handle the abort event when the connection is closed by the client
  signal.addEventListener('abort', () => {
    console.log('Client closed the connection.');
  });

  // begin event streaming from the OpenAI API
  const encoder = new TextEncoder();
  let upstreamResponse: Response;

  try {
    upstreamResponse = await postToOpenAI(input.api, '/v1/chat/completions', chatCompletionPayload(input, true), signal);
  } catch (error: any) {
    console.log(error);
    const message = '[OpenAI Issue] ' + (error?.message || typeof error === 'string' ? error : JSON.stringify(error)) + (error?.cause ? ' · ' + error.cause : '');
    return new ReadableStream({
      start: controller => {
        controller.enqueue(encoder.encode(message));
        controller.close();
      },
    });
  }
  
  // decoding and re-encoding loop

  const onReadableStreamStart = async (controller: ReadableStreamDefaultController) => {

    let hasBegun = false;

    // stream response (SSE) from OpenAI is split into multiple chunks. this function
    // will parse the event into a text stream, and re-emit it to the client
    const upstreamParser = createParser(event => {

      // ignore reconnect interval
      if (event.type !== 'event')
        return;

      // https://beta.openai.com/docs/api-reference/completions/create#completions/create-stream
      if (event.data === '[DONE]') {
        controller.close();
        return;
      }

      try {
        const json: OpenAIAPI.Chat.CompletionsResponseChunked = JSON.parse(event.data);

        // ignore any 'role' delta update
        if (json.choices[0].delta?.role)
          return;

        // stringify and send the first packet as a JSON object
        if (!hasBegun) {
          hasBegun = true;
          const firstPacket: ApiChatFirstOutput = {
            model: json.model,
          };
          controller.enqueue(encoder.encode(JSON.stringify(firstPacket)));
        }

        // transmit the text stream
        const text = json.choices[0].delta?.content || '';
        controller.enqueue(encoder.encode(text));

      } catch (error) {
        // maybe parse error
        console.error('Error parsing OpenAI response', error);
        controller.error(error);
      }
    });

    // https://web.dev/streams/#asynchronous-iteration
    const decoder = new TextDecoder();
    for await (const upstreamChunk of upstreamResponse.body as any)
      upstreamParser.feed(decoder.decode(upstreamChunk, { stream: true }));

  };
  
  return new ReadableStream({
    start: onReadableStreamStart,
    cancel: (reason) => console.log('chatStreamRepeater cancelled', reason),
  });

}


/**
 * The client will be sent a stream of words. As an extra (an totally optional) 'data channel' we send a
 * string JSON object with the few initial variables. We hope in the future to adopt a better
 * solution (e.g. websockets, but that will exclude deployment in Edge Functions).
 */
export interface ApiChatFirstOutput {
  model: string;
}
let requestLasts: { [ip: string]: number } = {};
let requestCounts: { [ip: string]: number } = {};

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

  try {
    
    const userApi = await req.json();
    const utilityKey = userApi.utilityKey;
    const fingerId = userApi.fingerId;
    const userId = userApi.userId;
    const responseMessages = userApi.response_messages;
    const inputs = userApi.inputs;
    const utilityInfo = await getUtilityInfo(utilityKey);
    const message = userApi.message;  

    let system_prompt = Object.keys(utilityInfo).includes("system_prompt")? utilityInfo.system_prompt:DEFAULT_SYSTEM_PROMPT;
    let user_prompt = Object.keys(utilityInfo).includes("user_prompt")? utilityInfo.user_prompt:'';
    
    const today_datetime = new Date().toUTCString();
    let messages: Message[] = [];
    let index=0;
    
    inputs.map((input: Input) => {
      if(input.type == "form" && user_prompt){
          user_prompt = user_prompt.replaceAll(`{${index}}`, input.value?input.value:'');
          index++;
      }
    });

   
    if(user_prompt) {
        user_prompt = user_prompt.replaceAll(`{${index}}`, `${message}`);
    }
    
    if(system_prompt){
        system_prompt = system_prompt.replaceAll("{{Today}}", today_datetime);
        messages =[{role: 'system', content: system_prompt}];
    }

    responseMessages.map((item) => {
      messages = [...messages, item];
    });

    let user_message: Message = UserMessageState ;
    console.log(user_prompt);

    user_message = {...user_message, 
        content: user_prompt?user_prompt:message, 
        // datetime: today_datetime,
    };

    messages.push(user_message);
    

    let [userTimes, isSubscription] = await Promise.all([getUserTimes(userId, fingerId), getSubscriptions(userId)]);
    if (!userId && userTimes <= 0) {
      throw new Error("User times have expired.");
    } else if (userTimes <= 0 && !isSubscription) {
      throw new Error("User subscription required.");
    }
    
    const apiChatInput = await extractOpenaiChatInputs({messages: messages, model: OPENAI_MODELID});
    const stream: ReadableStream = await chatStreamRepeater(apiChatInput, req.signal);
    const decreaseUser = await decreaseUserTimes(userId, fingerId, userTimes);
    return new NextResponse(stream);

  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.log('Fetch request aborted in handler');
      return new Response('Request aborted by the user.', { status: 499 }); // Use 499 status code for client closed request
    } else if (error.code === 'ECONNRESET') {
      console.log('Connection reset by the client in handler');
      return new Response('Connection reset by the client.', { status: 499 }); // Use 499 status code for client closed request
    } else {
      console.error('Fetch request failed:', error);
      return new NextResponse(`[Issue] ${error}`, { status: 400 });
    }
  }
};

//noinspection JSUnusedGlobalSymbols
export const config = {
  runtime: 'edge',
};