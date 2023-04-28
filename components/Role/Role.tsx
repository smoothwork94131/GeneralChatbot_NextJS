import { FC, useEffect } from 'react';
import { Flex, Space } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import { ROLE_GROUP } from '@/utils/app/const';
import { RoleGroup } from '@/types/role';

interface  Props {
    handleSelectRole: (index: number) => void;
    roleGroup: RoleGroup[]
    selectedRole: RoleGroup,
}
const RoleHome: FC<Props> = ({handleSelectRole, roleGroup, selectedRole}) => {
    useEffect(() => {
        
    });
    return (
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

interface TabInfo {
    name: string,
    index: number,
    handleSelectRole: (index: number) =>void;
    selectedRole:RoleGroup
}
export const RoleTab = ({index, name, selectedRole, handleSelectRole}: TabInfo) => {
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