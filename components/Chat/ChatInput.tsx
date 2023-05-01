import { 
    FC,
    KeyboardEvent,
    useState
} from 'react';
import { Flex, Image } from '@mantine/core';
import { IconSend } from '@tabler/icons-react';
import { Textarea } from '@mantine/core';
interface Props {
    onSend: (message: string) =>void
}
const ChatInput:FC<Props> = ({ onSend }) => {
    const [content, setContent] = useState<string>();
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setContent(value);
    };
    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if(e.key == "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };
    const handleSend = () => {
        if (!content) {
          alert("Please enter a message");
          return;
        }
        onSend(content);
    };
    return (
        <div>
            <Flex
                justify="flex-start"
                gap="xs"
            >
                <div className='w-[50px] pt-[10px]'>
                    <Image maw={30} mx="auto" radius="sd" src="icons/avatar_user.png" alt="chatgpt avatar" />
                </div>
                <Textarea
                    className='w-full overflow-hidden'
                    autosize
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    minRows={1} required
                    rightSection={
                        <IconSend size="1rem" style={{ display: 'block', opacity: 0.5 }} />
                    }
                />
            </Flex>
        </div>
    )
}

export default ChatInput;