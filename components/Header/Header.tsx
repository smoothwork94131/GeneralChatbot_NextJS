import { FC, useContext } from 'react';
import { Burger, Flex, Avatar, Menu } from '@mantine/core';
import Settings from '../Settings';
import HomeContext from '@/pages/index.context';
import OpenaiContext from '@/pages/api/openai/openai.context';
import Role from '../Role';

interface Props {
    handleShowSidebar: ()=>void;
    openedSidebar: boolean,
    isMobile: boolean
}
const OpenAiHeader:FC<Props> = ({handleShowSidebar, openedSidebar, isMobile}) => {
    const {
        state: {  },
    } = useContext(HomeContext) ;
    const {
        state: { roleGroup, selectedRole },
        handleSelectRole,
    } = useContext(OpenaiContext);

    return (
        
            <Flex
                justify="space-between"
                align='center'
            >
                <Flex
                    align='center'
                    gap="sm"
                >
                    <Burger 
                        opened={openedSidebar} 
                        onClick={handleShowSidebar}
                        mr="0"
                        color='#858C94'
                    />
                    <Role 
                        isMobile={isMobile}
                        handleSelectRole = {handleSelectRole}
                        roleGroup = {roleGroup}
                        selectedRole = {selectedRole}
                    />
                </Flex>
              
                <Menu shadow="md" width={200}>
                    <Menu.Target>
                        <Avatar 
                           
                            src="icons/avatar.png" alt="avatar" 
                            size={30}
                            mt={5}
                            mr={15}
                        />
                    </Menu.Target>
                    <Settings 
                        isMobile={isMobile}
                    />
                </Menu>
            </Flex>

    )
}
export default OpenAiHeader;