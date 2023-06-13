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
                            <Image maw={30} radius="sd" src="/icons/avatar_user.png" alt="chatgpt avatar" mt={`40px`}/>
                        }
                        <SimpleGrid cols={isMobile?1:3} verticalSpacing="xl" sx={(theme)=>({width: '100%'})}>
                            {
                                selectedUtility.buttonGroup?.map((group, group_index) =>
                                    <Flex key={group_index} gap="xs"
                                        align={isMobile?'center':'flex-start'}
                                    >
                                        {
                                            !isMobile?<></>:
                                            <Image maw={30} radius="sd" src="/icons/avatar_user.png" alt="chatgpt avatar" mt={`40px`}/>
                                        }
                                        <Box sx={(theme) =>({width: '100%'})}>
                                            <Box
                                                sx={(theme) =>({
                                                    textAlign: 'center'
                                                })}
                                            >
                                                <Button variant="outline"  radius="md" size="md" color='gray'
                                                    sx={(theme) =>({
                                                        position: 'relative',
                                                        top: '20px',
                                                        background: `${theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[1]} !important`,
                                                        color: `${theme.colorScheme == 'dark' ? theme.colors.gray[1]:theme.colors.dark[7]}`
                                                    })}
                                                    onClick={() => { if(selectedUtility.settings.length > 0) { showSettingModal(group.name)}} }
                                                >
                                                    {group.name}
                                                </Button>    
                                            </Box>
                                            <SimpleGrid 
                                                cols={
                                                    selectedUtility.buttonGroup?
                                                        selectedUtility.buttonGroup[group_index]?.buttons?.length < 3 ? selectedUtility.buttonGroup[group_index]?.buttons?.length:3
                                                    :3
                                                }
                                                sx={(theme)=>({
                                                    padding: theme.spacing.md,
                                                    border: `1px solid gray`,
                                                    borderRadius: theme.spacing.lg,
                                                    paddingTop: '40px',
                                                
                                                })}
                                            >
                                            {
                                                selectedUtility.buttonGroup?
                                                selectedUtility.buttonGroup[group_index]?.buttons.map((button, button_index) => 
                                                    <Button fullWidth variant="outline" key={button_index} color='gray' 
                                                        sx={(theme) =>({
                                                            color: `${theme.colorScheme == 'dark' ? theme.colors.gray[1]: theme.colors.gray[7]}`
                                                        })}
                                                        onClick={() => {handleSelectCustomButtons(group.name, button.name)}}
                                                    >
                                                        {button.name}
                                                    </Button>
                                                ):<></>
                                            }
                                            </SimpleGrid>
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