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
import { Conversation, Message } from '@/types/chat';


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

            inputs.map((input: Input, index: number) => {
                if(input.type == "form"){
                    prompt = prompt?.replace(`{${index}}`, input.value?input.value:'');
                }
            });
            if(inputs.length == 0 && prompt == '') {
                prompt = message;
            } else{
                prompt = prompt?.replace(`{${inputs.length}}`, message);
            }
            let messages:Message[] = [];
            messages=[...messages, {role: 'user',  content: message}]
           
            updatedConversation.prompt = prompt?prompt:'';
            setMessageIsStreaming(true);
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({
                prompt: prompt
                }),
            });
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            const data = response.body;
            if (!data) {
                return;
            }
            const reader = data.getReader();
            const decoder = new TextDecoder();
            let done = false;
            let text = "";
            let is_first = true;
            
            while (!done) {
                
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                const chunkValue = decoder.decode(value);
                text += chunkValue;
                if(is_first) {
                    is_first = false;
                    messages = [...messages, { role: 'assistant', content: chunkValue }];

                    const updatedMessages: Message[][] = [
                        ...updatedConversation.messages,
                        messages,
                    ];
                    updatedConversation = {
                        ...updatedConversation,
                        messages: updatedMessages,
                    };
                    saveSelectConverSation(updatedConversation);
                } else {
                    const updatedMessages: Message[][] =
                    updatedConversation.messages.map((message, index) => {
                        if (index === updatedConversation.messages.length - 1) {
                            return message.map((role_message) => {
                                if(role_message.role == "assistant") {
                                    return {
                                        ...role_message,
                                        content: text,
                                    };
                                }
                                return role_message;
                            });
                        }
                        return message;
                    });
                    updatedConversation = {
                        ...updatedConversation,
                        messages: updatedMessages,
                    };
                    saveSelectConverSation(updatedConversation);
                }
            }
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