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
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter'
import { IconArrowBackUp,
    IconArrowLeft, 
    IconChevronLeft} from '@tabler/icons-react';
import { Input } from '@/types/role';

interface Props {
    historyConversation: Conversation | undefined;
    messageIsStreaming: boolean;
    setInputContent: (content:string) =>void;
    saveSelctedConversation: (conversation: Conversation)=>void;
    isMobile: boolean;
    handleChangeUtilityInputsValue: (input_index: number, value: string)=>void,
}
const ChatMessage: FC<Props> = ({
        historyConversation, 
        messageIsStreaming, 
        setInputContent,
        saveSelctedConversation, 
        isMobile,
        handleChangeUtilityInputsValue
    }) => {
    const L10nsStrings = {
        prefixAgo: null,
        prefixFromNow: null,
        suffixAgo: '',
        suffixFromNow: '',
        seconds: '1m ago',
        minute: '1m ago',
        minutes: '%dm ago',
        hour: '1h',
        hours: '%dh ago',
        day: '1d ago',
        days: '%dd ago',
        month: '1mo',
        months: '%dmo ago',
        year: '1yr ago',
        years: '%dyr ago',
        wordSeparator: ' ',
    }
    const formatter = buildFormatter(L10nsStrings);
    const selectedMessages = historyConversation?.messages;
    const history_count = selectedMessages?.length?selectedMessages?.length:0;
    const [activeGroup, setActiveGroup] = useState<string[]>([]);
    const [collapse, setCollpase] = useState<boolean>(false);
    
    useEffect(() => {
        let updatedActive: string[] = [];

        historyConversation?.messages.map((message, index) => {
            if( message[0].active ||
                (index == 0 && !collapse)) {
                updatedActive.push(`${historyConversation.key}_${index}`);
            } 
        })
        if(!collapse &&  historyConversation?.messages.length == 0) {
            updatedActive = [`${historyConversation?.key}_0`];
        }
        setActiveGroup(updatedActive);
        setCollpase(false);
    },[historyConversation])
    
    useEffect(() => {
        if(historyConversation?.messages.length == 0) {
            setActiveGroup([`${historyConversation?.key}_0`]);
        }
    }, [])

    const onCollopase = (activeSatus) => {
        let updatedConversation:Conversation = ConversationState;
        if(historyConversation) {
            updatedConversation = historyConversation;
        }
        const messages = historyConversation?.messages.map((message, index) => {
            const active = activeSatus.filter((active) => `${historyConversation.key}_${index}` == active)
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
        setCollpase(true);
        saveSelctedConversation(updatedConversation);
    }
    const setInputs = (index) => {
        if(selectedMessages) {
            const real_index = history_count-index-1;
            setInputContent(selectedMessages[real_index][0].content);
            const inputs = selectedMessages[real_index][0].inputs;

            if(inputs) {
                if(inputs?.length > 0) {
                    for(let k = 0; k < inputs.length; k++) {
                        const input: Input = inputs[k];
                        handleChangeUtilityInputsValue(k, input.value?input.value:'');
                    }
                }
            }
        }
    }
    
    return (
        <Box
            sx={{
                flexGrow: 1,
                overflow: 'auto', // overflowY: 'hidden'
            }}
        > 
            {
                messageIsStreaming?
                <Group sx={(theme) => ({
                    padding: theme.spacing.md
                })}>
                    Thinking...<Loader color="gray" variant="dots"></Loader>
                </Group>
                :<></>
            }
            <Accordion 
                radius="xs" 
                chevron={<IconChevronLeft size="1rem" />}
                chevronPosition='left'
                variant="contained"
                multiple 
                value={activeGroup} 
                onChange={onCollopase}
                styles={{
                    chevron: {
                      '&[data-rotate]': {
                        transform: 'rotate(-90deg)',
                      },
                    },
                }}
            >
            {
                selectedMessages?.map((message, index) =>
                    <Box key={index}>
                        {
                            <Accordion.Item value={`${historyConversation?.key}_${index}`} key={index} sx={(theme) =>({
                                padding: "0px"
                            })}>
                                <Accordion.Control>
                                    <Flex
                                        align='center'
                                        sx={(theme) =>({
                                            justifyContent:'space-between'
                                        })}
                                    >
                                        
                                        <Flex
                                            align={isMobile?'flx-start':'center '}
                                            direction={isMobile?'column-reverse':'row'}
                                            justify="flex-start"
                                            wrap="wrap"
                                            sx={(theme) =>({
                                                width: isMobile?'72%':''
                                            })}
                                        >
                                            <Text
                                                style={{fontSize: '18px'}}
                                            >
                                                {selectedMessages[history_count-index-1][0].content}
                                            </Text>
                                            <Box
                                                sx={(theme)=>({
                                                    marginLeft: isMobile?'-5px':'0px'
                                                })}
                                            >
                                                {
                                                    selectedMessages[history_count-index-1][0].inputs?.map((input, index) =>
                                                        input.type == "form"?
                                                        <Badge key={index} ml={5}
                                                            size="xs"
                                                            radius="sm"
                                                            
                                                        >{input.value}</Badge>:<></>
                                                    )
                                                    
                                                }
                                            </Box>
                                        </Flex>                
                                        <Flex
                                            gap="xs"
                                            align='flex-end'
                                        >
                                            <IconArrowBackUp color='gray' size={isMobile?15:22} onClick={(event) => {
                                                event.stopPropagation();
                                                setInputs(index);
                                            }}/>
                                            {
                                                <Box
                                                    sx={(theme) => ({
                                                        '&:hover > time': { display: 'none' },
                                                        '&:hover > .date': { display: 'block' },
                                                    })}
                                                >
                                                    <Text  className='date' sx={(theme) =>({
                                                        display: 'none',
                                                        fontSize: theme.fontSizes.xs
                                                    })}>
                                                        {selectedMessages[history_count-index-1][1].datetime}
                                                    </Text>
                                                    <TimeAgo  
                                                        date={selectedMessages[history_count-index-1][1].datetime} 
                                                        formatter={formatter} 
                                                        style={{color: 'gray', fontSize:'12px',}}
                                                        locale={'en'}
                                                    />
                                                        
                                                </Box>
                                            }
                                        </Flex>
                                    </Flex>
                                </Accordion.Control>
                                <Accordion.Panel>
                                    <ChatMessageList
                                        key = {index}
                                        cursor={`${selectedMessages[history_count-index-1][1].content}${
                                            messageIsStreaming 
                                            && index == 0
                                            ? '`▍`': ''
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