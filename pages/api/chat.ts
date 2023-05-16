import { OpenAIStream } from "@/utils/server";
import { OpenAIStreamPayload } from "@/types/openai";
import { NextRequest, NextResponse } from 'next/server';
export const config = {
  runtime: "edge",
};

export default async function POST(req: Request): Promise<Response> {
  const { prompt } = (await req.json()) as {
    prompt?: string;
  };

  if (!prompt) {
    return new Response("No prompt in the request", { status: 400 });
  }

  const payload: OpenAIStreamPayload = {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 1000,
    stream: true,
    n: 1,
  };
  
  try{
    const stream = await OpenAIStream(payload);
    return new Response(stream);
  }catch(error: any) {
    console.error('Fetch request failed:', error);
    return new NextResponse(`[Issue] ${error}`, { status: 400 });
  }
}