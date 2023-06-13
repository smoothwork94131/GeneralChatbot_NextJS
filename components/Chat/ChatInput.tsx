import { 
    FC,
    KeyboardEvent,
    useState,
    MutableRefObject,
    useEffect
} from 'react';
import { Box, Flex, Image } from '@mantine/core';
import { IconSend, IconNotes } from '@tabler/icons-react';
import { Text, Textarea } from '@mantine/core';
import { LoaderIcon } from 'react-hot-toast';
import { Conversation } from '@/types/chat';
import { Utility } from '@/types/role';
interface Props {
    onSend: () =>void;
    textareaRef: MutableRefObject<HTMLTextAreaElement | null>;
    messageIsStreaming: boolean;
    inputContent:string;    
    setInputContent: (content: string)=>void;
    selectedConversation: Conversation;
    disabledEnter: boolean,
    inputError: string,
    selectedUtility: Utility
}
const ChatInput:FC<Props> = ({ onSend, textareaRef, messageIsStreaming,inputContent, setInputContent, selectedConversation, disabledEnter, inputError, selectedUtility}) => {
    const [textError, setTextError] = useState<string>();

    useEffect(() => {
        setTextError(inputError);   
    }, [inputError]);

    useEffect(() => {
        if (textareaRef && textareaRef.current) {
            textareaRef.current.style.height = 'inherit';
            textareaRef.current.style.height = `${textareaRef.current?.scrollHeight}px`;
            textareaRef.current.style.overflow = `${
            textareaRef?.current?.scrollHeight > 400 ? 'auto' : 'hidden'
          }`;
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setInputContent(value);
    };
    const handleKeyDown = (e: any) => {
        
        if(e.key == "Enter" && !e.shiftKey && !messageIsStreaming && disabledEnter) {
            e.preventDefault();
    
            handleSend();
            setInputContent("")
        }
    };
    const handleSend = () => {
        
        if (inputContent == "") {
            setTextError("Please enter a message");
            return;
        }

        setTextError("");
        onSend();
    };
    
    return (
        <Box>
            {
                selectedUtility.buttonGroup.length > 0?
                <Flex
                    justify='flex-end'
                    align='center'
                    gap='xs'
                    mb={15}
                    sx={(theme)=>({
                        cursor: 'pointer'
                    })}
                >
                    <IconNotes />
                    <Text>
                        Past from Clipboard
                    </Text>
                </Flex>:<></>
            }
            
            <Flex
                justify="flex-start"
                gap="xs"
                align='center'
            >  
                <Image maw={30} radius="sd" src="/icons/avatar_user.png" alt="chatgpt avatar" />
                <Textarea
                    className='w-full'
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    autosize
                    minRows={2}
                    maxRows={4}
                    
                    rightSection={
                        <Box
                            pr={20}
                        >
                            {
                                messageIsStreaming?
                                <LoaderIcon style={{width: '20px', height: '20px'}}></LoaderIcon>:
                                <IconSend size="1rem" className="opacity-[0.5] display-block cursor-pointer" onClick={() => {if(selectedUtility.buttonGroup.length == 0) {handleSend();}}} />
                            }
                        </Box>
                    }
                    value={inputContent}
                    ref={textareaRef}
                    error={textError}
                />
            </Flex>
        </Box>
        
    )
}

export default ChatInput;