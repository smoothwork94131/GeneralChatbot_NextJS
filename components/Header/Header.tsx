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
import { useUser } from '@supabase/auth-helpers-react';

interface Props {
    handleShowSidebar: ()=>void;
    openedSidebar: boolean,
    isMobile: boolean,
    updateServerRoleData: () =>void;
    selectedConversation: Conversation,
    changeSpotlightType: (type:string)=>void
}


const OpenAiHeader:FC<Props> = ({handleShowSidebar, openedSidebar, isMobile, updateServerRoleData, selectedConversation,changeSpotlightType}) => {
    const {
        state: { roleGroup, selectedRole },
        handleSelectRole,
    } = useContext(OpenaiContext);

    const user = useUser();
    const initialName = (full_name) => {
        const split = full_name.split(" ");
        let initial_name = "";
        if(split.length > 1) {
            initial_name = split[0].substr(0, 1)+split[1].substr(0, 1);
        } else {
            initial_name = split[0].substr(0, 1);
        }
        return initial_name;
    }
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
                            <Avatar color="cyan" radius="xl">{
                               initialName(user? user.user_metadata.full_name:'')
                            }</Avatar>
                        </Menu.Target>
                        <Settings 
                            isMobile={isMobile}
                            updateServerRoleData={updateServerRoleData}
                            changeSpotlightType={changeSpotlightType}
                        />
                    </Menu>
                </Group>
            </Group>
        </Box>
    )
}
export default OpenAiHeader;