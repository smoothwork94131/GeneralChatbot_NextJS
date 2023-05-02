import { FC } from 'react';
import { UtilitiesGroup, Utility } from '@/types/role';
import { NavLink, Space, Box, useMantineTheme } from '@mantine/core';
interface  Props {
    handleSelectUtility: (group_index: number, utility_index: number) => void;
    selectedUtilityGroup: UtilitiesGroup[]
    selectedUtility: Utility,
}
const Utils: FC<Props> = ({handleSelectUtility, selectedUtilityGroup, selectedUtility}) =>{
    const Theme = useMantineTheme();
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
                                active={selectedUtility.name == utility_item.name?true:false}
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
