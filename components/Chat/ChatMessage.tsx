import { FC } from 'react';
import { Box } from '@mantine/core';
import ChatMessageList  from '@/components/Chat/ChatMessageList';
import { Conversation } from '@/types/chat';
interface Props {
    selectedConversation: Conversation | undefined;
    messageIsStreaming: boolean;
}
const ChatMessage: FC<Props> = ({selectedConversation, messageIsStreaming}) => {
    return (
        <Box
            sx={{
                flexGrow: 1,
                overflow: 'auto', // overflowY: 'hidden'
            }}
        >
            {
                selectedConversation?.messages.map((message_group, g_index) =>
                selectedConversation?.messages[selectedConversation?.messages.length-g_index-1].map((message, index) => 
                        <ChatMessageList 
                            key = {index}
                            cursor={`${message.content}${
                                messageIsStreaming 
                                && g_index == 0
                                && index == 1
                                ? '`▍`' : ''
                            }`}
                            message = {message}
                            messageIsStreaming={messageIsStreaming}
                        />
                    )
                    
                )
            }
        </Box>
    )
}
export default ChatMessage;