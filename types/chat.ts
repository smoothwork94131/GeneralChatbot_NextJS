import { OpenAIModel } from './openai';
export type Role = 'assistant' | 'user' | 'system';
export interface Message {
    role: Role;
    content: string;
}
export interface Conversation {
    name: string;
    key: string;
    messages: Message[][];
    temperature?: number;
    datetime?:string,
}

export interface ChatBody {
    model: OpenAIModel;
    messages: Message[][];
    key: string;
    prompt: string;
    temperature?: number;
}
export const AssistantMessageState: Message = {
    role:'assistant',
    content:''
}
