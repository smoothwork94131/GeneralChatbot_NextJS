import { FC,
    useEffect,
    useState } from 'react';
import { Box, 
    Group, 
    Loader, 
    Accordion, 
    Flex,
    Text,
    Badge } from '@mantine/core';
import ChatMessageList  from '@/components/Chat/ChatMessageList';
import { Conversation, ConversationState, Message } from '@/types/chat';
import TimeAgo from 'react-timeago';
import englishStrings from 'react-timeago/lib/language-strings/en'
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter'
import { IconArrowBackUp } from '@tabler/icons-react';

interface Props {
    selectedConversation: Conversation | undefined;
    messageIsStreaming: boolean;
    setInputContent: (content:string) =>void;
    saveSelctedConversation: (conversation: Conversation)=>void;
}

const ChatMessage: FC<Props> = ({selectedConversation, messageIsStreaming, setInputContent, saveSelctedConversation}) => {

    const formatter = buildFormatter(englishStrings);
    const selectedMessages = selectedConversation?.messages;
    const history_count = selectedMessages?.length?selectedMessages?.length:0;
    const [activeGroup, setActiveGroup] = useState<string[]>([]);
    useEffect(() => {
        let updatedActive: string[] =[];
        selectedConversation?.messages.map((message, index) => {
            if(message[0].active) {
                updatedActive.push(`${selectedConversation.key}_${index}`);
            }
        })
        setActiveGroup(updatedActive);
    },[selectedConversation])

    const onCollopase = (activeSatus) => {
        console.log(activeSatus);
        let updatedConversation:Conversation = ConversationState;
        if(selectedConversation) {
            updatedConversation = selectedConversation;
        }
        const messages = selectedConversation?.messages.map((message, index) => {
            const active = activeSatus.filter((active) => `${selectedConversation.key}_${index}` == active)
            if(active.length > 0 ) {
                message[0].active = true;
            } else {
                message[0].active = false;
            }
            return message;
        })
        if(messages) {
            updatedConversation = {
                ...updatedConversation,
                messages: messages
            }
        }
        saveSelctedConversation(updatedConversation);
    }

    return (
        <Box
            sx={{
                flexGrow: 1,
                overflow: 'auto', // overflowY: 'hidden'
            }}
        >   
            <Accordion 
                radius="xs" 
                chevronPosition='left'
                variant="contained"
                multiple 
                value={activeGroup} 
                onChange={onCollopase}
            >
            {
                selectedMessages?.map((message, index) =>
                    <Box key={index}>
                        {
                            index == 0 ?
                            <Box>
                                <ChatMessageList
                                    key = {index}
                                    cursor={selectedMessages[history_count-index-1][0].content}
                                    index={index}
                                    message = {selectedMessages[history_count-index-1][0]}
                                    messageIsStreaming={messageIsStreaming}
                                />
                                {
                                    messageIsStreaming?
                                    <Group sx={(theme) => ({
                                        padding: theme.spacing.md
                                    })}>
                                        Thinking...<Loader color="gray" variant="dots"></Loader>
                                    </Group>
                                    :
                                    <ChatMessageList
                                        key = {index}
                                        cursor={`${selectedMessages[history_count-index-1][1].content}${
                                            messageIsStreaming 
                                            && index == 0
                                            ? '`▍`' : ''
                                        }`}
                                        index={index}
                                        message = {selectedMessages[history_count-index-1][1]}
                                        messageIsStreaming={messageIsStreaming}
                                    />
                                }
                                
                            </Box>:
                            <Accordion.Item value={`${selectedConversation?.key}_${index}`}>
                                <Accordion.Control>
                                    <Flex
                                        align='center'
                                        sx={(theme) =>({
                                            justifyContent:'space-between'
                                        })}
                                    >
                                        <Text >
                                            {selectedMessages[history_count-index-1][0].content}
                                            {
                                                selectedMessages[history_count-index-1][0].inputs?.map((input, index) => 
                                                    <Badge key={index} ml={5}>{input.value} </Badge>
                                                )
                                            }
                                        </Text> 
                                        <Group>
                                            <IconArrowBackUp color='gray' onClick={(event) => {
                                                setInputContent(selectedMessages[history_count-index-1][0].content);
                                                event.stopPropagation();
                                            }}/>
                                            {
                                                <Box
                                                    sx={(theme) => ({
                                                        '&:hover > time': { display: 'none' },
                                                        '&:hover > .date': { display: 'block' },
                                                    })}
                                                >
                                                    <Text  className='date' sx={(theme) =>({
                                                        display: 'none'
                                                    })}>
                                                        {selectedMessages[history_count-index-1][1].datetime}
                                                    </Text>
                                                    <TimeAgo  
                                                        date={selectedMessages[history_count-index-1][1].datetime} 
                                                        formatter={formatter} 
                                                        style={{color: 'gray'}}
                                                        locale={'en'}
                                                    />
                                                    
                                                </Box>
                                            }
                                        </Group>  
                                    </Flex>
                                </Accordion.Control>
                                <Accordion.Panel>
                                    <ChatMessageList
                                        key = {index}
                                        cursor={`${selectedMessages[history_count-index-1][1].content}${
                                            messageIsStreaming 
                                            && index == 0
                                            ? '`▍`' : ''
                                        }`}
                                        index={index}
                                        message = {selectedMessages[history_count-index-1][1]}
                                        messageIsStreaming={messageIsStreaming}
                                    />
                                </Accordion.Panel>
                            </Accordion.Item>
                        }
                    </Box>        
                )
                
            }
            </Accordion>
        </Box>
    )
}
export default ChatMessage;