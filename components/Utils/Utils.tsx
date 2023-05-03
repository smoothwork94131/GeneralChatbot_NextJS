import { FC } from 'react';
import { UtilitiesGroup, Utility } from '@/types/role';
import { NavLink,  Box } from '@mantine/core';
interface  Props {
    handleSelectUtility: (group_index: number, utility_index: number) => void;
    selectedUtilityGroup: UtilitiesGroup[]
    selectedUtility: Utility,
    collpaseUtiltyGroup: (group_index: number) =>void;
}
const Utils: FC<Props> = ({handleSelectUtility, selectedUtilityGroup, selectedUtility, collpaseUtiltyGroup}) =>{

    
    return(
        <Box  
            sx={(theme) =>({
                flexGrow: 1,
                zIndex: 100,
                overflow: 'auto',
                paddingTop: theme.spacing.md
            })}>
            {
                selectedUtilityGroup.map((group_item, group_index) => 
                   <NavLink
                        label={group_item.name}
                        key={group_index}
                        opened={
                            group_item.utilities.length > 0 ? 
                            selectedUtilityGroup[group_index].active
                                ? true:false
                            :false
                        }
                        onClick={()=> collpaseUtiltyGroup(group_index)}
                        sx={(theme) => ({
                            transition: 'none'
                        })}
                    >
                    {
                        group_item.utilities.length > 0?
                        group_item.utilities.map((utility_item, utility_index) => 
                            <NavLink 
                                key={utility_index}
                                label={
                                    utility_item.name
                                }
                                onClick={() => handleSelectUtility(group_index, utility_index)}
                                active={
                                    selectedUtility.name == utility_item.name || 
                                    utility_item.active?true:false
                                }
                                sx={(theme) => ({
                                    transform: 'none'
                                })}
                            ></NavLink>
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
