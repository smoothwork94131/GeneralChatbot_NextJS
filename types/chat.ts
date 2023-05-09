import { OpenAIModel } from './openai';
import { Input } from '@/types/role';

export type Role = 'assistant' | 'user' | 'system';
export interface Message {
    role: Role;
    content: string;
    datetime?: string;
    inputs?: Input[];
    active?:boolean;
}
export interface Conversation {
    name: string;
    key: string;
    messages: Message[][];
    temperature?: number;
    datetime?:string;
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
    content:'',
}

export const UserMessageState: Message = {
    role:'user',
    content:'',
}
export const ConversationState = {
    name: '',
    key: '',
    messages: []
}
