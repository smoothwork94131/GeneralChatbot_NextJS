import { FC, useContext, useState } from 'react';
import { Popover, Burger, Flex,  Image } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Settings from '../Settings';
import HomeContext from '@/pages/index.context';
import OpenaiContext from '@/pages/api/openai/openai.context';
import Role from '../Role';

interface Props {
    handleShowSidebar: ()=>void;
    isMobile: boolean
}
const Header:FC<Props> = ({handleShowSidebar, isMobile}) => {
    const [opened, { close, open }] = useDisclosure(false);
    const [pop_open, setPopOpen] = useState(false);
    const {
        state: { colorScheme },
    } = useContext(HomeContext) ;

    const {
        state: { roleGroup, selectedRole },
        handleSelectRole,
    } = useContext(OpenaiContext);

    return (
        <div className={`p-2 pr-5 ${colorScheme =='dark'?'bg-zinc-700':'bg-gray-200'}`} >
            <Flex
                justify="space-between"
            >
                <Flex
                    align='center'
                    gap="sm"
                >
                    <Burger opened={false} onClick={handleShowSidebar}/>
                    <Role 
                        isMobile={isMobile}
                        handleSelectRole = {handleSelectRole}
                        roleGroup = {roleGroup}
                        selectedRole = {selectedRole}
                        handleShowSidebar={handleShowSidebar}
                    />
                </Flex>
                
                <Popover width={230} position="bottom" withArrow shadow="md"  opened={pop_open} >
                    <Popover.Target>
                        <Image maw={30}  
                            onMouseEnter={()=>setPopOpen(true)} onMouseLeave={()=>setPopOpen(false)}
                            radius="md" src="icons/avatar.png" alt="avatar" />
                    </Popover.Target>
                    <Popover.Dropdown className='p-0'>
                        <Settings 
                            isMobile={isMobile}
                        />
                    </Popover.Dropdown>
                </Popover>
            </Flex>
        </div>
    )
}
export default Header;