import { 
    FC,
    KeyboardEvent,
    useState,
    MutableRefObject,
    useEffect
} from 'react';
import { Flex, Image } from '@mantine/core';
import { IconSend } from '@tabler/icons-react';
import { Textarea } from '@mantine/core';
import { LoaderIcon } from 'react-hot-toast';
interface Props {
    onSend: (message: string) =>void;
    textareaRef: MutableRefObject<HTMLTextAreaElement | null>;
    messageIsStreaming: boolean;
}
const ChatInput:FC<Props> = ({ onSend, textareaRef, messageIsStreaming }) => {
    const [content, setContent] = useState<string>();
    const [textError, setTextError] = useState<string>();
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
        setContent(value);
    };
    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if(e.key == "Enter" && !e.shiftKey && !messageIsStreaming) {
            e.preventDefault();
            handleSend();
            setContent("")
        }
    };
    const handleSend = () => {
        if (!content) {
            setTextError("Please enter a message");
            return;
        }
        setTextError("");
        onSend(content);
    };

    return (
        <Flex
            justify="flex-start"
            gap="xs"
            align='center'
        >  
            <Image maw={30} radius="sd" src="icons/avatar_user.png" alt="chatgpt avatar" />
            <Textarea
                className='w-full'
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                autosize
                minRows={1}
                maxRows={4}
                rightSection={
                    // <IconSend size="1rem" className="opacity-[0.5] display-block;" />
                    messageIsStreaming?
                    <LoaderIcon style={{width: '20px', height: '20px'}}></LoaderIcon>:
                    <IconSend size="1rem" className="opacity-[0.5] display-block;" />
                }
                value={content}
                ref={textareaRef}
                sx={(theme) => ({
                })}
                error={textError}
                withAsterisk
            />
        </Flex>
    )
}

export default ChatInput;