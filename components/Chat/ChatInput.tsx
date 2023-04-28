import { 
    FC,
    KeyboardEvent,
    useState
} from 'react';
import { Flex, Image } from '@mantine/core';
import { Input } from '@mantine/core';
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
        if(e.key == "Enter") {
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
                gap="xl"
                justify="flex-start"
            >
                <div className='w-[70px]'>
                    <Image maw={30} mx="auto" radius="sd" src="icons/avatar_user.png" alt="chatgpt avatar" />
                </div>
                <Textarea
                    className='w-full overflow-hidden min-h-[400px]'
                    rightSection={
                        <div className='cursor-pointer'>
                            <IconSend size="1rem" className='display-block opacity-[0.5]' />
                        </div>
                    }
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    minRows={1} required
                />
            </Flex>
        </div>
    )
}

export default ChatInput;