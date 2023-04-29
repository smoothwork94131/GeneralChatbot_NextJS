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
        state: { selectedUtilityGroup, selectedUtility, showSidebar },
        handleSelectUtility,
    } = useContext(OpenaiContext);
    
    const {
        state: { colorScheme },
    } = useContext(HomeContext);

    return (
        showSidebar?
            <div className={`p-2 pt-2 flex flex-col w-[300px]  z-10 h-screen 
                    ${colorScheme =="light"?'bg-[#F8F4F4]':'bg-[#1A1B1E]'}
                    ${showSidebar?'block':'hidden'}
                    ${isMobile?`fixed w-[270px]`:''}`
                }
            >
            {
                showSidebar && isMobile?
                <Flex
                    align='center'
                    gap={'xs'}
                >
                    <Search 
                    />
                    <IconArrowLeft size={24} onClick={handleShowSidebar}/>
                </Flex>:
                <Search 
                />
            }
            <Utils 
                selectedUtilityGroup = { selectedUtilityGroup }
                handleSelectUtility = {handleSelectUtility}
                selectedUtility = {selectedUtility}
            />
            {
                !isMobile?
                <Settings isMobile={isMobile}/>:<></>
            }
            
        </div>:
        <></>
        
    )
}
export default Sidebar; 