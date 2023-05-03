import { FC } from 'react';
import { 
    Flex, 
    Menu, 
    rem, 
    UnstyledButton, 
    Text ,
    Group
} from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import { RoleGroup } from '@/types/role';
import { IconChevronDown } from '@tabler/icons-react';
interface  Props {
    handleSelectRole: (index: number) => void;
    roleGroup: RoleGroup[]
    selectedRole: RoleGroup;
    isMobile: boolean;
}

const RoleHome: FC<Props> = ({handleSelectRole,roleGroup, selectedRole,isMobile}) => {
    return (
        isMobile?
        <Menu openDelay={100} closeDelay={400} zIndex={1000}>
            <Menu.Target>
                <UnstyledButton
                >
                    <Group spacing={3}>
                        <Text
                            sx={(theme) => ({
                                fontWeight: 600,
                            })}
                        >{selectedRole.name}</Text>
                        <Text
                            sx={(theme) => ({
                                fontWeight: 600,
                            })}
                        >
                            <IconChevronDown size={rem(17)} stroke={1.5} />
                        </Text>
                    </Group>
                </UnstyledButton>
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
        :
        <Flex>
            {
                roleGroup.map((item, index) =>
                    <RoleTab 
                        key={index}
                        index={index}
                        handleSelectRole={handleSelectRole}
                        name={item.name}
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


export const RoleMenu = ({index, name, handleSelectRole}: RoleInfo) => {
    return (
        <Menu.Item  onClick={() => {handleSelectRole(index)}}>
            <Text
                sx={(theme) =>({
                })}
            >{name}</Text>
        </Menu.Item>
    )
}
export const RoleTab = ({index, name, selectedRole, handleSelectRole}: RoleInfo) => {
    return (
        <Flex 
            sx={(theme) => ({
                padding: theme.spacing.sm,
                marginLeft: theme.spacing.sm,   
                textAlign: 'center',
                cursor: 'pointer',
                borderBottom: `2px solid ${theme.colors.orange[selectedRole.name == name? 8:2]}`,
                "&:hover" :{
                    borderBottom: `2px solid ${theme.colors.orange[8]}`
                }
            })}
            gap="xs"
            justify="flex-start"
            align="center"
            onClick={() => {handleSelectRole(index)}}
        >
            <Text 
                className={`bg-[#858C94] rounded-full w-[16px] h-[16px]  text-white p-[2px]`}
            >
                <IconCheck size={12}/>
            </Text>
            <Text
                sx={(theme) =>({
                fontSize: theme.fontSizes.md,
                })}
            >
                {
                    name
                }
            </Text>
        </Flex>
    )
}

export default RoleHome;