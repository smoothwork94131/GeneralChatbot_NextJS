import { FC, useContext, useEffect, useState } from 'react';
import Search from '@/components/Search';
import Utils from '@/components/Utils';
import Settings from '@/components/Settings';
import OpenaiContext from '@/pages/api/openai/openai.context';
import HomeContext from '@/pages/index.context';
import { IconArrowLeft} from '@tabler/icons-react';
import { Flex } from '@mantine/core';

interface Props {
    isMobile: boolean
    handleShowSidebar:() => void;
}

const Sidebar: FC<Props> = ({isMobile, handleShowSidebar}) =>{
    const {
        state: { selectedUtilityGroup, selectedUtility },
        handleSelectUtility,
    } = useContext(OpenaiContext);
    
    const {
        state: { colorScheme },
    } = useContext(HomeContext);

    return (

        <div className={`p-2 pt-2 flex flex-col h-screen 
                    ${colorScheme =="light"?'bg-[#F8F4F4]':'bg-[#1A1B1E]'}`
                }
            >
            {/* {
                isMobile?
                <Flex
                    align='center'
                    gap={'xs'}
                    justify={'flex-start'}
                >
                    <Search 
                    />
                    <IconArrowLeft size={24} onClick={handleShowSidebar} color='#858C94'/>
                </Flex>:
                
                <Search 
                />
            } */}
            <Search 
                />
            <Utils 
                selectedUtilityGroup = { selectedUtilityGroup }
                handleSelectUtility = {handleSelectUtility}
                selectedUtility = {selectedUtility}
            />
            {
                !isMobile?
                <Settings isMobile={isMobile}/>:<></>
            }
        </div>

        
    )
}
export default Sidebar; 