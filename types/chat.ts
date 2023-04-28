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
