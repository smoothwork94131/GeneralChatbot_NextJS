import { Utility } from "@/types/role";
import { FC } from "react";
import { 
    Flex, 
    Box,
    Button,
    SimpleGrid,
    Image
} from '@mantine/core';

interface Props {
    selectedUtility: Utility,
    isMobile: boolean,
    handleSelectCustomButtons: (group_name: string, button_name: string) =>void,
    showSettingModal: (modal_title: string)=>void,
}
const ButtonGroup:FC<Props> = ({selectedUtility, isMobile, handleSelectCustomButtons, showSettingModal}) => {
    return (
        <div>
            {
                selectedUtility.buttonGroup?.length?
                selectedUtility.buttonGroup?.length > 0?
                <Flex
                    justify="flex-start"
                    gap="xs"
                    align="center"
                >
                    {
                        isMobile?<></>:
                        <Image maw={30} radius="sd" src="/icons/avatar_user.png" alt="chatgpt avatar" mt={`20px`}/>
                    }
                    <SimpleGrid cols={isMobile?1:3} verticalSpacing="xs" sx={(theme)=>({width: '100%'})}>
                        {
                            selectedUtility.buttonGroup?.map((group, group_index) =>
                                <Flex key={group_index} gap="xs" align={isMobile?'center':'flex-start'}
                                >
                                    {
                                        !isMobile?<></>:
                                        <Image maw={30} radius="sd" src="/icons/avatar_user.png" alt="chatgpt avatar" mt={`20px`}/>
                                    }
                                    <Box sx={(theme) =>({width: '100%'})} mt={`-20px`}>
                                        <Box
                                            sx={(theme) =>({
                                                textAlign: 'center'
                                            })}
                                        >
                                            <Button variant="outline" radius="md" size="sm" color='gray'
                                                sx={(theme) =>({
                                                    position: 'relative',
                                                    top: '20px',
                                                    background: `${theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[0]} !important`,
                                                    color: `${theme.colorScheme == 'dark' ? theme.colors.gray[1]:theme.colors.dark[7]}`
                                                })}
                                                onClick={() => { if(selectedUtility.settings.length > 0) { showSettingModal(group.name)}} }
                                            >
                                                {group.name}
                                            </Button>    
                                        </Box>
                                        <Flex
                                            mih={50}
                                            gap={{ base: 'md', sm: 'xs' }}
                                            justify={{ base: "center", sm: 'space-around' }}
                                            align="center"
                                            direction="row"
                                            wrap="wrap"
                                            sx={(theme)=>({
                                                padding: theme.spacing.md,
                                                border: `1px solid gray`,
                                                borderRadius: theme.spacing.lg,
                                                paddingTop: '30px'
                                            })}
                                        >
                                        {
                                            selectedUtility.buttonGroup?
                                            selectedUtility.buttonGroup[group_index]?.buttons.map((button, button_index) => 
                                                <Button 
                                                    key={button_index} 
                                                    variant="outline" 
                                                    size="xs" 
                                                    color='gray' 
                                                    sx={(theme) =>({
                                                        color: `${theme.colorScheme == 'dark' ? theme.colors.gray[1]: theme.colors.gray[7]}`,
                                                        width: '25%',
                                                        minWidth: '80px'
                                                    })}
                                                    onClick={() => {handleSelectCustomButtons(group.name, button.name)}}
                                                >
                                                    {button.name}
                                                </Button>
                                            ):<></>
                                        }
                                        </Flex>
                                    </Box>
                                </Flex>
                            )
                        }
                    </SimpleGrid>
                </Flex>
                :<></>:<></>
            }
        </div>
    )
}

export default ButtonGroup;