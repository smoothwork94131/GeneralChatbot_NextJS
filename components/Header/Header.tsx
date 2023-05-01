import { FC, useContext, useState   } from 'react';
import { Popover, Burger, Flex, Header, Avatar, ColorScheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
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
    const [pop_open, setPopOpen] = useState(false);
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
                <Popover width={230} position="bottom" withArrow shadow="md"  opened={pop_open} >
                    <Popover.Target>
                        <Avatar 
                            onMouseEnter={()=>setPopOpen(true)} onMouseLeave={()=>setPopOpen(false)}
                            src="icons/avatar.png" alt="avatar" 
                            size={30}
                            mt={5}
                            mr={15}/>
                    </Popover.Target>
                    <Popover.Dropdown className='p-0'>
                        <Settings 
                            isMobile={openedSidebar}
                        />
                    </Popover.Dropdown>
                </Popover>
            </Flex>

    )
}
export default OpenAiHeader;