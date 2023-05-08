import { 
    FC, 
    useEffect, 
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
import { AssistantMessageState, Conversation, Message, UserMessageState } from '@/types/chat';
import { OPENAI_API_HOST, OPENAI_API_KEY, OPENAI_API_MAXTOKEN, OPENAI_MODELID } from '@/utils/app/const';
import { ApiChatInput, ApiChatResponse } from '@/pages/api/openai/chat';

interface Props {
    selectedUtility: Utility;
    handleChangeUtilityInputsValue: (input_index: number, value: string)=>void,
    selectedConversation: Conversation,
    saveSelectConverSation: (conversation: Conversation)=>void;
} 

const ChatContent: FC<Props> = ({
    selectedUtility, 
    handleChangeUtilityInputsValue, 
    selectedConversation,
    saveSelectConverSation}) =>{

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [messageIsStreaming, setMessageIsStreaming] = useState(false);
    const handleSend = async(message: string) => {
        if(selectedConversation) {
            let updatedConversation:Conversation = selectedConversation;

            const inputs = selectedUtility.inputs.filter((input: Input) => input.type == "form");
            let prompt = selectedUtility.prompt;

            const today_datetime = new Date().toISOString().split('T')[0];
            let messages: Message[] = [];
            let system_message =  prompt?.systemMessage;
            let user_message = prompt?.userMessage;
            inputs.map((input: Input, index: number) => {
                if(input.type == "form" && user_message){
                    user_message = user_message.replaceAll(`{${index}}`, input.value?input.value:'');
                }
            });
            if(user_message) {
                if(inputs.length > 0) {
                    user_message = user_message.replaceAll(`{${inputs.length}}`, `: "${message}"`);
                } 
            }
            if(user_message =="") {
                user_message = message;
            }
            if(system_message){
                messages =[{role: 'system', content: system_message}];
            }
            const selectedMessagesHistory = selectedConversation.messages;
            selectedMessagesHistory.map((messages_item) => {
                messages_item.map((message) => {
                    messages = [...messages, message];
                })
            });

            let user_prompt: Message = UserMessageState ;
            if(user_message){
                user_prompt = {role: 'user',  content: user_message};
            }
            
            messages.push(user_prompt);
            
            setMessageIsStreaming(true);
            
            const input: ApiChatInput = {
                api: {
                    apiKey: OPENAI_API_KEY,
                    apiHost: OPENAI_API_HOST,
                    apiOrganizationId:''
                },
                model: OPENAI_MODELID,
                messages: messages,
                max_tokens: OPENAI_API_MAXTOKEN,
            };

            updatedConversation.messages.push([user_prompt, AssistantMessageState]);
            
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
            const data: ApiChatResponse = await response.json();
            
            const assistant_message: Message = data.message;
            
            const updatedMessages: Message[][] =
                updatedConversation.messages.map((message, index) => {
                if (index === updatedConversation.messages.length - 1) {
                    return message.map((role_message) => {
                        if(role_message.role == "assistant") {
                            role_message = assistant_message
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
                    return <FormComponent 
                        key={input_key}
                        data={input.options}
                        defaultValue={input.value}
                        className={input.style}
                        onChange={(event:React.ChangeEvent<HTMLInputElement>) => handleChangeInput(input_key, event)}
                    />;    
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
            />
            <Space h="md"/>
            <ChatMessage 
                selectedConversation={selectedConversation}
                messageIsStreaming={messageIsStreaming}
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
 }
export const InputComponet = (Component: any) => {
    return (
        <Component />
    )
}
export default ChatContent;