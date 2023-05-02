import { FC } from 'react';
import { 
    Flex, 
    Space, 
    Image, 
    Text,
    Box
} from '@mantine/core';
import ChatInput from './ChatInput';
import { Utility } from '@/types/role';

interface Props {
    selectedUtility: Utility;
    handleChangeUtilityInputsValue: (input_index: number, value: string)=>void
}

const handleSend = async(message: string) => {
    /*
    const controller = new AbortController();
    const chatBody: ChatBody = {
        model: {
            id: 'gpt-3.5-turbo',
            maxLength: 12000,
            name: "GPT-3.5",
            tokenLimit: 4000
        },
        messages: [
            {role: 'user', content: message},
            {role: 'assistant', content: message}
        ],
        key: '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',
        prompt: "You are ChatGPT, a large language model trained by OpenAI. Follow the user's instructions carefully. Respond using markdown.",
        temperature: 1,
    };
    
    const body = JSON.stringify(chatBody);
    const response = await fetch("api/chat", {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        signal: controller.signal,
        body,
    });
    if (response.ok) {
        const data = response.body;
        const reader = data?.getReader();
        const decoder = new TextDecoder();
    }
    */

}
const ChatMessage: FC<Props> = ({selectedUtility, handleChangeUtilityInputsValue}) =>{
    const componentUtilityInputs = () => {
        if(selectedUtility.inputs.length > 0) {
            return selectedUtility.inputs.map((input: any, input_key: any) =>
                <input.component
                    key={input_key}
                    data={input.options}
                    defaultValue={input.value}
                    className={input.style}
                    onChange={(event:React.ChangeEvent<HTMLInputElement>) => handleChangeInput(input_key, event)}
                />        
            )
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
                    gap="xs"
                    align='center'
                    sx={(theme) => ({
                        paddingLeft: theme.spacing.xl,
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
            />
            <Space h="md"/>
            <Flex
                sx={(theme) => ({
                    flexGrow: 1,
                })}
            >
                    
                <Flex
                >
                    <Image maw={30} src="icons/avatar_gpt.png" alt="chatgpt avatar" />
                    <Box>
                        
                    </Box>
                </Flex>    
            </Flex>
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
export default ChatMessage;