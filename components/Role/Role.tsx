import { FC, useEffect } from 'react';
import { Flex, Menu } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import { RoleGroup } from '@/types/role';
import { IconCaretDown } from '@tabler/icons-react';
interface  Props {
    handleSelectRole: (index: number) => void;
    roleGroup: RoleGroup[]
    selectedRole: RoleGroup;
    isMobile: boolean;
    handleShowSidebar: ()=>void;
}
const RoleHome: FC<Props> = ({handleSelectRole, handleShowSidebar,roleGroup, selectedRole,isMobile}) => {
    
    useEffect(() => {

    });
    return (
        isMobile?
        <div>
            <Menu openDelay={100} closeDelay={400}>
                <Menu.Target>
                    <Flex
                        align="center"
                    >
                        <div>{selectedRole.name}</div>
                        <IconCaretDown size={20}/>
                    </Flex>
                </Menu.Target>
                <Menu.Dropdown>
                    {
                        roleGroup.map((item, index) =>
                            <RoleMenu
                                key={index}
                                index={index}
                                name={item.name}
                                handleSelectRole={handleSelectRole}
                                selectedRole={selectedRole}
                            />
                        )
                    }
                </Menu.Dropdown>
            </Menu>
        </div>:
        <Flex>
            {
                roleGroup.map((item, index) =>
                    <RoleTab 
                        key={index}
                        index={index}
                        name={item.name}
                        handleSelectRole={handleSelectRole}
                        selectedRole={selectedRole}
                    />
                )
            }
        </Flex>
    )
}

interface RoleInfo {
    name: string,
    index: number,
    handleSelectRole: (index: number) =>void;
    selectedRole:RoleGroup
}


export const RoleMenu = ({index, name, selectedRole, handleSelectRole}: RoleInfo) => {
    return (
        <Menu.Item  onClick={() => {handleSelectRole(index)}}>
            {name}
        </Menu.Item>
    )
}
export const RoleTab = ({index, name, selectedRole, handleSelectRole}: RoleInfo) => {
    return (
        <div 
            className={`m-2 p-1 text-center cursor-pointer border-b-2 border-solid border-orange-${selectedRole.name == name?'600':'200'} hover:border-orange-600`}
            onClick={() => {handleSelectRole(index)}}
            >
            <Flex 
                className='p-[10px]' 
                gap="xs"
                justify="flex-start"
                align="center"
            >
                <div className={`bg-[#858C94] rounded-full w-[16px] h-[16px]  text-white p-[2px]`}>
                    <IconCheck size={12}/>
                </div>
                <div className='m-l-15'>
                    {
                        name
                    }
                </div>
            </Flex>
        </div>
    )
}

export default RoleHome;