import { 
    FC, 
    useState,
    useRef } from 'react';
import { 
    Flex, 
    Space, 
    Text,
    Box
} from '@mantine/core';
import ChatInput from './ChatInput';
import { Input, Utility } from '@/types/role';
import ChatMessage from '@/components/Chat/ChatMessage';
import { AssistantMessageState, Conversation, ConversationState, Message, Role, UserMessageState } from '@/types/chat';
import { OPENAI_API_HOST, OPENAI_API_KEY, OPENAI_API_MAXTOKEN, OPENAI_MODELID, DefaultSystemPrompt } from '@/utils/app/const';
import { ApiChatInput, ApiChatResponse } from '@/pages/api/openai/chat';
import { useEffect } from 'react';

interface Props {
    selectedUtility: Utility;
    handleChangeUtilityInputsValue: (input_index: number, value: string)=>void,
    selectedConversation: Conversation,
    saveSelectConverSation: (conversation: Conversation)=>void;
    isMobile: boolean;
    conversationHistory: Conversation[]
} 

const ChatContent: FC<Props> = ({
        selectedUtility, 
        handleChangeUtilityInputsValue, 
        selectedConversation,
        saveSelectConverSation,
        isMobile,
        conversationHistory
    }) =>{
    
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [messageIsStreaming, setMessageIsStreaming] = useState(false);
    const [inputContent,  setInputContent] = useState<string>('');
    const [historyConversation, setHistoryConversation] = useState<Conversation>();
    
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
            setMessageIsStreaming(false);
        }
    }, [selectedUtility])

    const handleSend = async(message: string) => {
        if(selectedConversation) {
            let updatedConversation:Conversation = ConversationState;

            const history = localStorage.getItem("selectedConversation");
            if(history) {
                updatedConversation = JSON.parse(history);
            } else{
                updatedConversation = selectedConversation;
            }
            const inputs = selectedUtility.inputs;
            let system_prompt = Object.keys(selectedUtility).includes("system_prompt")? selectedUtility.system_prompt:DefaultSystemPrompt;
            let user_prompt = Object.keys(selectedUtility).includes("user_prompt")? selectedUtility.user_prompt:'';
            
            const today_datetime = new Date().toUTCString();
            let messages: Message[] = [];
            let index=0;
            inputs.map((input: Input) => {
                if(input.type == "form" && user_prompt){
                    user_prompt = user_prompt.replaceAll(`{${index}}`, input.value?input.value:'');
                    index++;
                }
            });
            if(user_prompt) {
                if(inputs.length > 0) {
                    user_prompt = user_prompt.replaceAll(`{${index}}`, `: ${message}`);
                } 
            }
            if(system_prompt){
                system_prompt = system_prompt.replaceAll("{{Today}}", today_datetime);
                messages =[{role: 'system', content: system_prompt}];
            }
            
            
            let selectedMessagesHistory:Message[][] = []; selectedMessagesHistory = [...selectedMessagesHistory, ...selectedConversation.messages]
            selectedMessagesHistory.map((messages_item) => {
                messages_item.map((message) => {
                    messages = [...messages, message];
                })
            });
            
            
            let user_message: Message = UserMessageState ;
            
            user_message = {...user_message, 
                content: user_prompt?user_prompt:message, 
                datetime: today_datetime,
            };
            
            messages.push(user_message);
            
            
            setMessageIsStreaming(true);
            
            const request_messages: Message[] = [];
            
            messages.map((item) => {
                request_messages.push({
                    role:item.role,
                    content: item.content
                });
            });

            
            const input: ApiChatInput = {
                api: {
                    apiKey: OPENAI_API_KEY,
                    apiHost: OPENAI_API_HOST,
                    apiOrganizationId:''
                },
                model: OPENAI_MODELID,
                messages: request_messages.map((item) => {
                    if(item.datetime) delete item?.datetime;
                    if(item.inputs) delete item?.inputs;
                    return item;
                }),
                max_tokens: OPENAI_API_MAXTOKEN,
            };
            
            
            user_message = {
                role: 'user',
                content: message,
                inputs: inputs,
                datetime: today_datetime,
                active: false
            };
             
            updatedConversation.messages.push([user_message, AssistantMessageState]);
            
            
            
            saveSelectConverSation(updatedConversation);
            const response = await fetch('/api/openai/chat', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(input),
            });

            if (!response.ok) {
                console.error('Error from API call: ', response.status, response.statusText);
                return '';
            }
            
            const data = await response.json();
            const assistant_message: Message = data.message;
            
            const updatedMessages: Message[][] =
                updatedConversation.messages.map((message, index) => {    
                    if (index === updatedConversation.messages.length-1) {
                        return message.map((role_message) => {
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
            setMessageIsStreaming(false);
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

    return (
        <Box
            sx={(theme) => ({
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
            })}
        >
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
            />
            <Space h="md"/>
            <ChatMessage 
                historyConversation={historyConversation}
                messageIsStreaming={messageIsStreaming}
                setInputContent={(content)=> {setInputContent(content)}}
                saveSelctedConversation={saveSelectConverSation}
                isMobile={isMobile}
                handleChangeUtilityInputsValue = {handleChangeUtilityInputsValue}
            />
            <Text ta="center"
                sx={(theme) => ({
                    fontSize: theme.fontSizes.xs
                })} 
            >   
                ChatGPT Mar 23 version. Free Research Preview. ChatGPT may produce inaccurate information about people, places, or facts.
            </Text>
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