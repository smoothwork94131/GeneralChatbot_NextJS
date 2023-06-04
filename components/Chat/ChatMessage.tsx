import { FC,
    useEffect,
    useState } from 'react';
import { Box,
    Accordion, 
    Flex,
    Text,
    Tooltip,
    Badge
} from '@mantine/core';
import ChatMessageList  from '@/components/Chat/ChatMessageList';
import { Conversation, ConversationState, Message } from '@/types/chat';
import TimeAgo from 'react-timeago';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter'
import { IconArrowBackUp,
    IconCheck,
    IconChevronRight,
    IconTrash} from '@tabler/icons-react';

import { Input, SelectedSearch, Utility } from '@/types/role';
import { IconCopy } from '@tabler/icons-react';

interface Props {
    historyConversation: Conversation | undefined;
    messageIsStreaming: boolean;
    setInputContent: (content:string) =>void;
    saveSelctedConversation: (conversation: Conversation)=>void;
    isMobile: boolean;
    handleChangeUtilityInputsValue: (input_index: number, value: string)=>void,
    selectedSearch: SelectedSearch,
    clearSelectedSearch: () =>void,
    selectedUtility: Utility,
    deleteConversation: (index: number)=>void;
}
const ChatMessage: FC<Props> = ({
        historyConversation, 
        messageIsStreaming, 
        setInputContent,
        saveSelctedConversation, 
        isMobile,
        handleChangeUtilityInputsValue,
        selectedSearch,
        clearSelectedSearch,
        selectedUtility,
        deleteConversation
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
    const [copied, setCopied] = useState<number>(-1);
    const [reuse, setReuse] = useState<number>(-1);
    const [timeAgo, setTimeAgo] = useState<number>(-1);

    
    useEffect(() => {
        
        let updatedActive: string[] = [];
        historyConversation?.messages.map((message, index) => {
            if( message[0].active ||
                ((index == 0 || 
                    (selectedSearch.history_index == (historyConversation?.messages.length - 1 - index) &&
                    historyConversation.key == selectedSearch.utility_key)
                )
                && !collapse)) {
                    
                updatedActive.push(`${historyConversation.key}_${index}`);
            } 
        })
        if(!collapse &&  historyConversation?.messages.length == 0) {
            updatedActive = [`${historyConversation?.key}_0`];
        }
        setActiveGroup(updatedActive);
        setCollpase(false); 
        setTimeout(goSelectedSection, 2000);

    },[historyConversation, selectedSearch])
    
    useEffect(() => {
        if(historyConversation?.messages.length == 0) {
            setActiveGroup([`${historyConversation?.key}_0`]);
        }
        setTimeout(goSelectedSection, 1000);
    }, [])

    const goSelectedSection = () => {
        const element = document.getElementById(`messages-${selectedSearch.history_index}`);
        if (element) {
            element.scrollIntoView({behavior: 'smooth',block: 'start'});
        }
    }
    
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
        clearSelectedSearch();
        saveSelctedConversation(updatedConversation);
    }
    
    const handleCopyToClipboard = (message: string, index: number) => {
        copyToClipboard(message);
        setCopied(index);
        setTimeout(function(){
            setCopied(-1);
        }, 1000);
    };
    function copyToClipboard(text: string) {
        if (typeof navigator !== 'undefined')
          navigator.clipboard.writeText(text)
            .then(() => console.log('Message copied to clipboard'))
            .catch((err) => console.error('Failed to copy message: ', err));
        
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
        setReuse(index);
        setTimeout(function() {
            setReuse(-1);
        }, 2000);
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
                chevron={<IconChevronRight size="1rem" />}
                chevronPosition='left'
                variant="contained"
                multiple 
                value={activeGroup} 
                onChange={onCollopase}
                styles={{
                    chevron: {
                      '&[data-rotate]': {
                        transform: 'rotate(90deg)',
                      },
                    },
                }}
            >
            {
                selectedMessages?.map((message, index) =>
                    <Box key={index}>
                        {
                            <Accordion.Item 
                                id={`messages-${selectedMessages.length-index-1}`}
                                value={`${historyConversation?.key}_${index}`} 
                                key={index} sx={(theme) =>({
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
                                            align='center'
                                            justify='flex-end'
                                            sx={(theme)=>({
                                                width: '140px'
                                            })}
                                            
                                        >
                                           
                                            <Tooltip label={reuse == index? 'Copied to Input':'Re-use'}  
                                                // opened={reuse == index?true:false}
                                            >
                                                {
                                                    reuse == index ?
                                                    <IconCheck color='gray' size={isMobile?'15px':'18px'}/>
                                                    :
                                                    <IconArrowBackUp color='gray' size={isMobile?'15px':'18px'} onClick={(event) => {
                                                        event.stopPropagation();
                                                        setInputs(index);
                                                    }}/>
                                                }
                                            </Tooltip>
                                            
                                            
                                            <Tooltip label='Delete'>
                                                {
                                                    <IconTrash color='gray' size={isMobile?'15px':'18px'} onClick={(event) => {
                                                        event.stopPropagation();
                                                        deleteConversation(selectedMessages.length-index-1)
                                                    }}/>
                                                }
                                            </Tooltip>
                                            <Tooltip label={selectedMessages[history_count-index-1][1].datetime} 
                                                opened={timeAgo == index? true:false} 
                                                onMouseEnter={() =>{setTimeAgo(index)}}
                                                onMouseLeave={()=>{setTimeAgo(-1)}}
                                            >   
                                                <Box onClick={(event) => {event.stopPropagation(); 
                                                            setTimeAgo(index);
                                                        }
                                                    }
                                                    pb= {isMobile?3:2}
                                                >
                                                    <TimeAgo
                                                        date={selectedMessages[history_count-index-1][1].datetime} 
                                                        formatter={formatter} 
                                                        style={{color: 'gray', fontSize: isMobile?'12px':'15px',}}
                                                        locale={'en'}
                                                    />
                                                </Box>
                                            </Tooltip>
                                            
                                        </Flex>
                                    </Flex>
                                </Accordion.Control>
                                <Accordion.Panel>
                                    <Box
                                        sx={(theme) =>({
                                            textAlign: 'right',
                                            width: '100%',
                                            display: 'flex',
                                            justifyContent: 'flex-end',
                                            cursor: 'pointer',
                                        })}
                                        className='copy-assistant'
                                    >
                                        <Tooltip label={copied == index? 'Copied':'Copy'} opened={copied == index?true:false}>
                                            {
                                                copied == index ?
                                                <IconCheck 
                                                    style={{color: 'gray',}}
                                                />:
                                                <IconCopy 
                                                    style={{color: 'gray',}}
                                                    onClick={(event) => {
                                                            handleCopyToClipboard(selectedMessages[history_count-index-1][1].content, index)
                                                            event.stopPropagation();
                                                        }
                                                    }
                                                />
                                            }
                                        </Tooltip>
                                    </Box>
                                    <ChatMessageList
                                        key = {index}
                                        cursor={`${selectedMessages[history_count-index-1][1].content} ${
                                            messageIsStreaming 
                                            && (index == 0 || selectedUtility.streaming)
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