import { FC } from 'react';
import { Flex, Space, Image } from '@mantine/core';
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
            {role: 'user', content: message}
        ],
        key: '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',
        prompt: updatedConversation.prompt,
        temperature: updatedConversation.temperature,
    };

    const response = await fetch("api/chat", {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        signal: controller.signal,
        body,
    });
    */
}
const ChatMessage: FC<Props> = ({selectedUtility, handleChangeUtilityInputsValue}) =>{
    const componentUtilityInputs = () => {
        if(selectedUtility.inputs.length > 0) {
            return selectedUtility.inputs.map((input: any, input_key: any) =>
                <input.component
                    key={input_key}
                    data={input.options}
                    searchable={true}
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
        <div className='h-full flex flex-col'>
            <Space h="md"/>
            <div className='text-[32px]'>
                {selectedUtility.name}
            </div>
            <div className='text-[22] text-gray-500'>
                {selectedUtility.summary}
            </div>
            <Space h="md"/>
            {
                selectedUtility.inputs.length > 0?
                <Flex
                    gap="xs"
                    align='center'
                >
                    <div className='w-[50px]'></div>
                    {
                        componentUtilityInputs()
                    }
                    <div className='w-1/6'></div>
                </Flex>
                :<></>
            }
            <Space h="md"/>
            <ChatInput 
                onSend={(message) => handleSend(message)}
            />
            <Space h="md"/>
            <div className='flex-grow overflow-auto'>
                <Flex
                    justify="flex-start"
                >
                    <div className='w-[50px] pr-2'>
                        <Image maw={30} mx="auto" radius="sd" src="icons/avatar_gpt.png" alt="chatgpt avatar" />
                    </div>
                    <div className='flex-grow overflow-auto'>
                    </div>
                </Flex>    
            </div>
            <div className="px-3 pt-2 pb-3 text-center text-[12px]">
                ChatGPT Mar 23 version. Free Research Preview. ChatGPT may produce inaccurate information about people, places, or facts.
            </div>
        </div>
    )
}
export default ChatMessage;