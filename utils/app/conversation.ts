
import { Conversation } from "@/types/chat";
export const saveSelctedConversation = (conversation: Conversation) => {
    localStorage.setItem('selectedConversation', JSON.stringify(conversation));
};
export const saveConversationHistory = (conversations: Conversation[]) => {
    localStorage.setItem('conversationHistory', JSON.stringify(conversations));
};