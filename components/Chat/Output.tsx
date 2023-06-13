
import { Flex, Image, Textarea, Text, Group, Space, Box } from "@mantine/core";
import { IconArrowBackUp, IconArrowRight, IconCheck, IconCopy } from "@tabler/icons-react";
import { FC, useState} from "react";

interface Props {
    isMobile: boolean,
    responseText: string,
    handleSend: () =>void
}
const Output:FC<Props> = ({isMobile, responseText, handleSend}) => {
    const [copied, setCopied] = useState<boolean>(false);

    const handleCopyToClipboard = () => {
        setCopied(true);
        copyToClipboard(responseText);
        setTimeout(function() {
            setCopied(false);
        }, 1000);
    };  

    function copyToClipboard(text: string) {
        if (typeof navigator !== 'undefined')
          navigator.clipboard.writeText(text)
            .then(() => console.log('Message copied to clipboard'))
            .catch((err) => console.error('Failed to copy message: ', err));    
    }
        
    return (
        <div>
            {
                isMobile?<></>:
                <Flex
                    justify='flex-end'
                    align='center'
                    gap='md'
                    mb={15}
                    sx={(theme)=>({
                        cursor: 'pointer'
                    })}
                >
                    <Group
                        spacing="xs"
                        onClick={() => {handleSend()}}
                    >
                        <IconArrowBackUp />
                        <Text>
                            Regenerate
                        </Text>        
                    </Group>
                    <Group
                        spacing="xs"
                        onClick={() => {handleCopyToClipboard()}}
                    >
                        {
                            copied?
                            <IconCheck />:<IconCopy />
                        }
                        <Text>
                            {
                                copied?
                                'Copied ':'Copy '
                            }
                            to Clipboard
                        </Text>        
                    </Group>
                </Flex>
            }
            
            <Flex
                justify="flex-start"
                gap="xs"
                align='center'
            >  
                <Image maw={30} radius="sd" src="/icons/avatar_gpt.png" alt="chatgpt avatar" />
                <Textarea
                    className='w-full'
                    autosize
                    minRows={2}
                    maxRows={4}
                    value={responseText}
                />
            </Flex>
            <Space h="md"/>
            {
                
                isMobile?
                <Flex>
                    <Box sx={(theme)=>({width: '45px'})}>
                    </Box>
                    <Box
                        sx={(theme)=>({width: '100%', padding: theme.spacing.md, background: theme.colorScheme == "dark"?theme.colors.gray[8]:theme.colors.gray[2], borderRadius: theme.spacing.xs})}
                    >
                        <Flex 
                            justify='center'
                            align='center'
                            gap='sm'
                            onClick={() => {handleCopyToClipboard()}}
                        >
                            {
                                copied?
                                <IconCheck />:<IconCopy />
                            }

                            <Text>
                                {
                                    copied?
                                    'Copied ':'Copy '
                                }
                                to Clipboard
                            </Text>
                            <IconArrowRight />
                        </Flex>
                    </Box>
                    
                </Flex>
                :<></>
            }
           
        </div>
    )
}
export default Output;