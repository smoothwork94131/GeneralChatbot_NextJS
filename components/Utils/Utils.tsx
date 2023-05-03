import { FC, useState, useEffect } from 'react';
import { UtilitiesGroup, Utility } from '@/types/role';
import { NavLink,  Box } from '@mantine/core';
interface  Props {
    handleSelectUtility: (group_index: number, utility_index: number) => void;
    selectedUtilityGroup: UtilitiesGroup[]
    selectedUtility: Utility,
}
const Utils: FC<Props> = ({handleSelectUtility, selectedUtilityGroup, selectedUtility}) =>{
    const [collapseUtilities, setCollapseUtilites] = useState<Boolean[]>([]);
    useEffect(() =>{
        let collapse=[];
        for(let k = 0; k<selectedUtilityGroup.length;k++){
            if(selectedUtilityGroup[k].utilities.filter((item) => item.active == true).length > 0) {
                collapse.push(true);
            } else{
                collapse.push(false);
            }
        }
        console.log(collapse);
        setCollapseUtilites(collapse);
    },[selectedUtilityGroup]);

    const updateCollapse = (group_index: number) => {
        const collpase = collapseUtilities; collpase[group_index] = !collpase[group_index];
        setCollapseUtilites([...collpase]);
    }
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
                                collapseUtilities[group_index]
                                ? true:false
                            :false
                        }
                        onClick={()=> updateCollapse(group_index)}
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
