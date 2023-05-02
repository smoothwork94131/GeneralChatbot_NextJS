import { OpenAIModel } from './openai';
export type Role = 'assistant' | 'user';
export interface Message {
    role: Role;
    content: string;
}
export interface Conversation {
    id: string;
    name: string;
    messages: Message[];
    prompt: string;
    temperature: number;
}

export interface ChatBody {
    model: OpenAIModel;
    messages: Message[];
    key: string;
    prompt: string;
    temperature: number;
}
