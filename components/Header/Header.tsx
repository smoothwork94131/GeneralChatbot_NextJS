import { FC, useContext } from 'react';
import { 
    Burger, 
    Avatar, 
    Menu, 
    Box, 
    Group } from '@mantine/core';
import Settings from '../Settings';
import OpenaiContext from '@/components/openai/openai.context';
import Role from '../Role';
import AccountButtons from '@/components/Account/AccountButtons';
import { Conversation } from '@/types/chat';
import { IconSearch } from '@tabler/icons-react';
import { spotlight } from '@mantine/spotlight';

interface Props {
    handleShowSidebar: ()=>void;
    openedSidebar: boolean,
    isMobile: boolean,
    updateServerRoleData: () =>void;
    selectedConversation: Conversation
}

const OpenAiHeader:FC<Props> = ({handleShowSidebar, openedSidebar, isMobile, updateServerRoleData, selectedConversation}) => {
    const {
        state: { roleGroup, selectedRole },
        handleSelectRole,
    } = useContext(OpenaiContext);

    
    return (
        <Box
            component="header"
            sx={(theme) => ({
              padding: `${theme.spacing.md} ${theme.spacing.md}`,
              borderBottom: `1px solid ${theme.colorScheme == 'dark'? theme.colors.gray[8]: theme.colors.gray[1]}`
            })}
        >
            <Group position="apart">
                <Group>
                    <Burger 
                        opened={openedSidebar} 
                        onClick={handleShowSidebar}
                        size="sm"
                        sx={(theme) => ({
                            color: theme.colors.gray[7]
                        })}
                    />
                    <Role 
                        isMobile={isMobile}
                        handleSelectRole = {handleSelectRole}
                        roleGroup = {roleGroup}
                        selectedRole = {selectedRole}
                    />
                </Group>
                <Group>
                    <AccountButtons selectedConversation={selectedConversation} isMobile={true}/>
                    <IconSearch 
                        onClick={() => spotlight.open()}
                    />
                    <Menu shadow="md" width={200}>
                        <Menu.Target>
                            <Avatar color="cyan" radius="xl">JM</Avatar>
                        </Menu.Target>
                        <Settings 
                            isMobile={isMobile}
                            updateServerRoleData={updateServerRoleData}
                        />
                    </Menu>
                </Group>
            </Group>
        </Box>
    )
}
export default OpenAiHeader;