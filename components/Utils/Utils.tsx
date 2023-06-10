import { FC } from 'react';
import { RoleGroup, UtilitiesGroup, Utility } from '@/types/role';
import { NavLink,  Box } from '@mantine/core';
import { IconMistOff } from '@tabler/icons-react';
import Link from 'next/link';

interface  Props {
    handleSelectUtility: (utility_key:string) => void;
    selectedUtilityGroup: UtilitiesGroup[]
    selectedUtility: Utility,
    collpaseUtiltyGroup: (name: string) =>void;
    selectedRole: RoleGroup
}

const Utils: FC<Props> = ({
        handleSelectUtility, 
        selectedUtilityGroup, 
        selectedUtility, 
        collpaseUtiltyGroup,
        selectedRole
    }) =>{
    
    const getUrls = (org_utility_name:string, group_name:string) => {
        const role_name = selectedRole.name.replace(" ","-");
        const utility_name = org_utility_name.replace(" ", "-");
        const formatted_group_name = group_name.replace(" ", "-");
        return `/${role_name}/${formatted_group_name}/${utility_name}`;
    };  

    return(
        <Box  
            sx={(theme) =>({
                flexGrow: 1,
                zIndex: 100,
                overflow: 'auto',
                paddingTop: theme.spacing.md
            })}>
            {
                selectedUtilityGroup.length == 0 ?
                <Box sx={(theme) => ({
                   fontSize: 14,
                    textAlign:'center'
                })}>
                    <IconMistOff size={30} className="mx-auto mb-3"/>
                    <text>
                        No data.
                    </text>
                </Box>:
                selectedUtilityGroup.map((group_item, group_index) => 
                   <NavLink
                        label={group_item.name}
                        key={group_index}
                        opened={
                            group_item.utilities.length > 0 ? 
                                selectedUtilityGroup[group_index].active ? true:false
                            :false
                        }
                        onClick={()=> collpaseUtiltyGroup(group_item.name)}
                        sx={(theme) => ({
                            transition: 'none'
                        })}
                    >
                    {
                        group_item.utilities.length > 0?
                        group_item.utilities.map((utility_item, utility_index) => 
                            <Link href={getUrls(utility_item.name, group_item.name)} key={utility_index}>
                                <NavLink 
                                    key={utility_index}
                                    label={
                                        utility_item.name
                                    }
                                    active={
                                        selectedUtility.key == utility_item.key 
                                    }
                                    sx={(theme) => ({
                                        transform: 'none'
                                    })}
                                    
                                ></NavLink>
                        
                            </Link>

                            
                        )
                        :<></>
                    }
                    </NavLink>
                )
            }
            
        </Box>
    )
}

export default Utils;