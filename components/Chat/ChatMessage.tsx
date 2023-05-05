import { FC } from 'react';
import { 
    Flex, 
    Space, 
    Image, 
    Text,
    Box
} from '@mantine/core';
import ChatInput from './ChatInput';
import { Input, Utility } from '@/types/role';
import {
    useState
} from 'react';
interface Props {
    selectedUtility: Utility;
    handleChangeUtilityInputsValue: (input_index: number, value: string)=>void
}   

const ChatMessage: FC<Props> = ({selectedUtility, handleChangeUtilityInputsValue}) =>{
    const [response, setResponse] = useState<String>("");
    const handleSend = async(message: string) => {
        const inputs = selectedUtility.inputs.filter((input: Input) => input.type == "form");
        let prompt_message = selectedUtility.prompt_message;
        inputs.map((input: Input, index: number) => {
            if(input.type == "form"){
                prompt_message = prompt_message?.replace(`{${index}}`, input.value?input.value:'');
            }
        });
        prompt_message = prompt_message?.replace(`{${inputs.length}}`, message);

        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              prompt: prompt_message
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
        while (!done) {
            const { value, done: doneReading } = await reader.read();
            done = doneReading;
            const chunkValue = decoder.decode(value);
            setResponse((prev) => prev + chunkValue);
            console.log(chunkValue);
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
            />
            <Space h="md"/>
            <Flex
                sx={(theme) => ({
                    flexGrow: 1,
                })}
            >
                <Flex
                    gap="xs"
                >
                    <Image maw={30} src="icons/avatar_user.png" alt="chatgpt avatar" />
                    <Box>
                        {
                            response
                        }
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
export default ChatMessage;