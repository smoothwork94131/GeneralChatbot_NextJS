import { FC } from 'react';
import { Flex, Select, Space, Image } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import ChatInput from './ChatInput';
import { Utility } from '@/types/role';
interface Props {
    selectedUtility: Utility;
    translateFrom: string;
    translateTo: string;
}

const handleSend = (message: string) => {

}
const ChatMessage: FC<Props> = ({selectedUtility, translateFrom, translateTo}) =>{
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
                selectedUtility.name == "Translate"?
                <Flex
                    gap="xl"
                >
                    <div className='w-[70px]'></div>
                    {
                        selectedUtility.inputs.map((input: any, input_key: any) =>
                            input.name == "icon" ?
                            <IconArrowRight size={24} key={input_key} className='text-gray-400'/>:
                            <Select
                                key={input_key}
                                data={input.options}
                                searchable
                                nothingFound="No languages"
                                defaultValue={input.name == "Language From"?translateFrom:translateTo}
                            />
                        )
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
                    gap="xl"
                    justify="flex-start"
                >
                    <div className='w-[70px]'>
                        <Image maw={30} mx="auto" radius="sd" src="icons/avatar_gpt.png" alt="chatgpt avatar" />
                    </div>
                    <div className='flex-grow overflow-auto'>

                    </div>
                </Flex>    
            </div>
            <div className="px-3 pt-2 pb-3 text-center text-[12px]  md:px-4 md:pt-3 md:pb-6">
                ChatGPT Mar 23 version. Free Research Preview. ChatGPT may produce inaccurate information about people, places, or facts.
            </div>
        </div>
    )
}
export default ChatMessage;