import { FC } from 'react';
import { UtilitiesGroup, Utility } from '@/types/role';
import { NavLink, Space } from '@mantine/core';
interface  Props {
    handleSelectUtility: (group_index: number, utility_index: number) => void;
    selectedUtilityGroup: UtilitiesGroup[]
    selectedUtility: Utility
}
const Utils: FC<Props> = ({handleSelectUtility, selectedUtilityGroup}) =>{
    return (
        <div className='flex-grow overflow-auto z-100'>
            <Space h="md" />
            {
                selectedUtilityGroup.map((group_item, group_index) => 
                    <NavLink 
                        key={group_index}
                        label={
                            <div className={`text-[16px] font-medium`}>{group_item.name}</div>
                        }
                        childrenOffset={20}
                        className='text-gray-500'
                    >
                    {
                        group_item.utilities.length > 0?
                        group_item.utilities.map((utility_item, utility_index) => 
                            <NavLink 
                                key={utility_index}
                                label={
                                    <div className='text-[16px] font-medium '>{utility_item.name}</div>
                                }
                                onClick={() => handleSelectUtility(group_index, utility_index)}
                                color="#DBE8FF"
                                className='text-gray-500'
                            ></NavLink>
                        )
                        :<></>
                    }
                    </NavLink>
                )
            }
        </div>
    )
}

export default Utils;
