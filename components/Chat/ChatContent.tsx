import { 
    FC, 
    useState,
    useRef } from 'react';
import { 
    Flex, 
    Space, 
    Text,
    Box,
    Group,
    Button
} from '@mantine/core';
import ChatInput from './ChatInput';
import { Input, SelectedSearch, Utility } from '@/types/role';
import ChatMessage from '@/components/Chat/ChatMessage';
import { AssistantMessageState, Conversation, Message,  UserMessageState } from '@/types/chat';
import { useEffect } from 'react';
import { getUserTimes } from '@/utils/app/supabase-client';
import { useRouter } from 'next/router';
import { useUser } from '@supabase/auth-helpers-react';
import { AuthenticationForm } from '@/components/Account/AuthenticationForm';
import Subscription from '@/components/Account/Subscription';
import MyModal from '@/components/Account/Modal';
import { getFingerId } from '@/utils/app/FingerPrint';
import { OPENAI_MODELID } from '@/utils/app/const';

interface Props {
    selectedUtility: Utility;
    handleChangeUtilityInputsValue: (input_index: number, value: string)=>void,
    selectedConversation: Conversation,
    saveSelectConverSation: (conversation: Conversation)=>void;
    isMobile: boolean;
    conversationHistory: Conversation[],
    selectedSearch: SelectedSearch,
    clearSelectedSearch: () =>void;
    deleteConversation: (index: number)=>void;
    messageIsStreaming: boolean;
    setMessageIsStreamming: (type: boolean)=>void;
} 

const ChatContent: FC<Props> = ({
        selectedUtility, 
        handleChangeUtilityInputsValue, 
        selectedConversation,
        saveSelectConverSation,
        isMobile,
        conversationHistory,
        selectedSearch,
        clearSelectedSearch,
        deleteConversation,
        messageIsStreaming,
        setMessageIsStreamming
    }) =>{
    
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [inputContent,  setInputContent] = useState<string>('');
    const [historyConversation, setHistoryConversation] = useState<Conversation>();
    const [isModal, setIsModal] = useState<boolean>(false);
    const [isLimitModal, setIsLimitModal] = useState<boolean>(false);

    const [modalType, setModalType] = useState<string>('signin');
    const [isSubscription , setSubscription ] = useState<boolean>(false);
    
    const user = useUser();
    
    useEffect(() => {
        const fetchData = async() => {
            // const data = await chkIsSubscription(user);
            // setSubscription(data);
        }
        fetchData();
        if(modalType == "signup" && user) {
            setModalType('subscription');
            setIsModal(true);
        }
    },[user]);

    useEffect(() => {
        setInputContent("");
    }, [selectedConversation])

    useEffect(() => {
        const history = localStorage.getItem("selectedConversation");
        if(history) {
            setHistoryConversation(JSON.parse(history));
        }
    }, [selectedConversation, selectedUtility, conversationHistory]);
    
    useEffect(() => {    
        if(messageIsStreaming) {
            setMessageIsStreamming(false);
        }
    }, [selectedUtility])

    const handleSend = async(message: string) => {
        
        const fingerId = await getFingerId();

        const userTimes = await getUserTimes(user);

        if(userTimes <= 0 ) {
            setIsLimitModal(true);
            return;
        }
        
        if(selectedConversation) {
            let updatedConversation:Conversation = JSON.parse(JSON.stringify(selectedConversation));    
            const inputs = JSON.parse(JSON.stringify(selectedUtility.inputs));
            const today_datetime = new Date().toUTCString();
            let messages: Message[] = [];
            
       
            let selectedMessagesHistory:Message[][] = []; selectedMessagesHistory = 
            [...selectedMessagesHistory, 
            ...updatedConversation.messages];
            
            if(selectedUtility.include_prompt_history){
                selectedMessagesHistory.map((messages_item) => {
                    messages_item.map((message) => {
                        messages = [...messages, message];
                    })
                });    
            }
            
        
            setMessageIsStreamming(true);
            
            const response_messages: Message[] = [];
            
            messages.map((item) => {
                response_messages.push({
                    role:item.role,
                    content: item.content,
                    inputs: item.inputs
                });
            });
            
            response_messages.push({
                role: 'user',
                content: message,
                inputs: inputs
,           });

            const input: {
                response_messages: Message[],
                utilityKey: string,
                fingerId: string,
                userId: string|null
            } = { 
                response_messages: response_messages.map((item) => {
                    if(item.datetime) delete item?.datetime;
                    return item;
                }),
                utilityKey: selectedUtility.key,
                fingerId: fingerId,
                userId: user?user.id:null
            };

            const user_message: Message = {    
                role: 'user',
                content: message,
                inputs: inputs,
                datetime: today_datetime,
                active: false
            };

            updatedConversation.messages.push([user_message, AssistantMessageState]);
            saveSelectConverSation(updatedConversation);

            const controller = new AbortController();
            const signal = controller.signal;
            let endpoint = 'chat';
            if(selectedUtility.streamming) {
                endpoint = 'stream-chat';
            }

            const response = await fetch('/api/openai/'+endpoint, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(input),
                signal
            });
            
            if (!response.ok) {
                if(response.status == 401) {
                    setModalType('auth');      
                    setIsModal(true); 
                    setMessageIsStreamming(false);
                    return;
                } else if(response.status == 402) {
                    setModalType('Subscription');
                    setIsModal(true); 
                    setMessageIsStreamming(false);
                    return;
                } else if(response.status ==  429) {
                    alert("Too many requests");
                    setMessageIsStreamming(false);
                    return;
                }
                console.error('Error from API call: ', response.status, response.statusText);
                return '';
            }
            
            if(selectedUtility.streamming) {
                let first = true;
                if(response.body) {
                    const reader = response.body.getReader();
                    const decoder = new TextDecoder("utf-8");
                    let text = "";
                    let done = false;
                    
                    while (!done) {
                        if(first) {
                            first = false;
                            continue;
                        }

                        const { value, done: doneReading } = await reader.read();
                        done = doneReading;
                        const chunkValue = decoder.decode(value);
                        
                        if (chunkValue) {
                        text += chunkValue.replace(JSON.stringify({"model":OPENAI_MODELID}), "");
                        const assistant_message: Message = {role: 'assistant', content: text};
                        const updatedMessages: Message[][] =
                            updatedConversation.messages.map((message, index) => {    
                                if (index === updatedConversation.messages.length-1) {
                                    message = message.map((role_message) => {
                                        if(role_message.role == "assistant") {
                                            role_message = assistant_message;
                                            role_message = {
                                                ...role_message,
                                                datetime: today_datetime,
                                            }
                                        }
                                        return role_message;
                                    });
                                }
                                return message;
                            });
                            updatedConversation = { 
                                ...updatedConversation,
                                messages: updatedMessages,
                                datetime: today_datetime
                            };
                            
                            saveSelectConverSation(updatedConversation);
                        }
                        
                    }
                }
            } else {
                const data = await response.json();
                const assistant_message: Message = data.message;
                
                const updatedMessages: Message[][] =
                updatedConversation.messages.map((message, index) => {    
                    if (index === updatedConversation.messages.length-1) {
                        message = message.map((role_message) => {
                            if(role_message.role == "assistant") {
                                role_message = assistant_message;
                                role_message = {
                                    ...role_message,
                                    datetime: today_datetime,
                                }
                            }
                            return role_message;
                        });
                    }
                    return message;
                });
                updatedConversation = { 
                    ...updatedConversation,
                    messages: updatedMessages,
                    datetime: today_datetime
                };

                saveSelectConverSation(updatedConversation);
            }
            setMessageIsStreamming(false);
        }
    }
    
    const componentUtilityInputs = () => {
        if(selectedUtility.inputs.length > 0) {
            return selectedUtility.inputs.map((input: Input, input_key: number) =>{
                const component = input.component;
                const FormComponent:React.FC<ComponentProps> = require("@mantine/core")[component];
                const IconComponent:React.FC<ComponentProps> = require("@tabler/icons-react")[component];
                
                if(input.type == "icon") {
                    return <IconComponent 
                        key={input_key}
                        className={input.style}
                    />; 
                } else {
                    let formComponent = <FormComponent 
                        key={input_key}
                        data={input.options}
                        value={input.value}
                        defaultValue={input.value}
                        className={input.style}
                        onChange={(event:React.ChangeEvent<HTMLInputElement>) => handleChangeInput(input_key, event)}
                    />; 
                    return formComponent;
                }
            })
        } 
    };
    
    const handleChangeInput = (index: number , e: React.ChangeEvent<HTMLInputElement> | string) => {
        let value='';
        
        if(typeof e == 'string') {
           value = e; 
        } else {
            value = e.target.value;
        }
        handleChangeUtilityInputsValue(index, value);
    }
    const closeModal = () => {
        setIsModal(false);
    }
    const closelimitModal = () => {
        setIsLimitModal(false);
    }
    return (
        <Box
            sx={(theme) => ({
                display: 'flex',
                flexDirection: 'column',
            })}
        >
            <Box>
                <Space h="md"/>
                <Text 
                    sx={(theme) => ({
                        fontSize: theme.fontSizes.lg,
                        fontWeight: 600
                    })}
                >
                    {selectedUtility.name}
                </Text>
                <Text 
                    sx={(theme) => ({
                        fontSize: theme.fontSizes.sm,
                    })}
                >
                    {selectedUtility.summary}
                </Text>
                <Space h="md"/>
                {
                    selectedUtility.inputs.length > 0?
                    <Flex
                        gap="sm"
                        align='center'
                        direction={selectedUtility.input_align == "horizental"?'row':'column'}
                        sx={(theme) => ({
                            paddingLeft: theme.spacing.chatInputPadding,
                        })}
                    >
                        {
                            componentUtilityInputs()
                        }
                    </Flex>
                    :<></>
                }
                <Space h="md"/>
                <ChatInput
                    onSend={(message) => handleSend(message)}
                    textareaRef={textareaRef}
                    messageIsStreaming={messageIsStreaming}
                    inputContent={inputContent}
                    setInputContent={(content)=> {setInputContent(content)}}
                    selectedConversation = {selectedConversation}
                />
                <Space h="md"/>
                <ChatMessage 
                    historyConversation={historyConversation}
                    messageIsStreaming={messageIsStreaming}
                    setInputContent={(content)=> {setInputContent(content)}}
                    saveSelctedConversation={saveSelectConverSation}
                    isMobile={isMobile}
                    handleChangeUtilityInputsValue = {handleChangeUtilityInputsValue}
                    selectedSearch={selectedSearch}
                    clearSelectedSearch={clearSelectedSearch}
                    selectedUtility={selectedUtility}
                    deleteConversation={deleteConversation}
                />
            </Box>
            
            <MyModal
                size={modalType == 'signin' || modalType == 'signup'?'  sm':'sm'}
                isModal={isModal}
                child={modalType == 'signin' || modalType == 'signup'? <AuthenticationForm modalType={modalType} closeModal={closeModal}/>:<Subscription closeModal={closeModal} />}
                title=''
                closeModal={closeModal}
                withCloseButton={false}
            />
            
            <MyModal
                size='sm'
                isModal={isLimitModal}
                child={<Box sx={(theme) => ({
                    padding: theme.spacing.md,
                    paddingTop: 0
                })}>
                    <Text sx={(theme) => ({
                        textAlign: 'center',
                        fontSize: theme.fontSizes.lg
                    })}>
                        You have reached free trial limit
                    </Text>
                    {
                        !user?
                        <Group position="right" sx={(theme) => ({
                            marginTop: '15px',
                        })}>
                            
                            <Button variant="outline" onClick={() => {
                                setIsLimitModal(false);
                                setModalType('signin');
                                setIsModal(true);                                
                            }}>
                                Sign In
                            </Button>
                            <Button className='bg-sky-500/100' onClick={() => {
                                setIsLimitModal(false);
                                setModalType('signup');
                                setIsModal(true);
                            }}>
                                Create Account
                            </Button>
                        </Group>:
                        <Button variant="outline" onClick={() => {
                            setModalType('subscription');
                            setIsLimitModal(false);
                            setIsModal(true);
                        }}>
                            Upgrade
                        </Button>                        
                    }
                </Box>}
                title=''
                closeModal={closelimitModal}
            />
        </Box>
    )
}

interface ComponentProps {  
    key: number;
    data?: string[] | undefined;
    defaultValue?: string | number | undefined;
    className: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    value?:string;
 }
export const InputComponet = (Component: any) => {
    return (
        <Component />
    )
}

export default ChatContent;