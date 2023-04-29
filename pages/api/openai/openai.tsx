import { useCreateReducer } from '@/hooks/useCreateReducer';
import { initialState, OpenaiInitialState } from './openai.state';
import OpenaiContext from './openai.context';
import  SideBar  from '@/components/Sidebar';
import  Chat  from '@/components/Chat';
import { Flex } from '@mantine/core';
import { ROLE_GROUP } from '@/utils/app/const';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { MOBILE_LIMIT_WIDTH } from '@/utils/app/const';
interface Props {

}
const OpenAi = ({
    
}: Props) => {

    const [isMobile, setIsMobile] = useState(false);
    const contextValue = useCreateReducer<OpenaiInitialState>({
        initialState,
    });
    const {
        state: {
            selectedRole, showSidebar
        },
        dispatch,
    } = contextValue;

    const handleSelectRole = (index: number) => {
        const updatedRole = ROLE_GROUP.filter(
            (r, r_index) => r_index == index
        );
        if(updatedRole.length > 0) {
            dispatch({
                field: "selectedRole",
                value: updatedRole[updatedRole.length - 1]
            });
            dispatch({
                field: 'selectedUtilityGroup',
                value: updatedRole[updatedRole.length - 1].utilities_group
            });
            dispatch({
                field: 'selectedUtility',
                value: updatedRole[updatedRole.length - 1].utilities_group[0].utilities[0]
            })
        }
    };
    const handleSelectUtility = (group_index: number, utility_index: number) => {
        const updatedUtility = selectedRole?.utilities_group[group_index].utilities.filter(
            (u, u_index) => u_index == utility_index
        );
        if(updatedUtility && updatedUtility.length > 0) {
            dispatch({
                field: "selectedUtility",
                value: updatedUtility[updatedUtility?.length - 1] 
            })    
        }
    };
    useEffect(()=>{
        window.addEventListener('resize', function(){
            responseWindow();
        });
        responseWindow();
    },[])
    const responseWindow = () => {
        if(window.innerWidth < MOBILE_LIMIT_WIDTH) {
            setIsMobile(true);
            dispatch({
                field: 'showSidebar',
                value: false
            })
        } else {
            setIsMobile(false);
            dispatch({
                field: 'showSidebar',
                value: true
            })
        }
    }
    const handleShowSidebar = () => {
        dispatch({
            field: 'showSidebar',
            value: !showSidebar
        })
        
    };

    return (
        <OpenaiContext.Provider
            value={{
                ...contextValue,
                handleSelectRole,
                handleSelectUtility       
            }}
        >
            <Flex
                justify="flex-start"
                align="flex-start"
                direction="row"
                gap="md"
            >
                <SideBar
                    handleShowSidebar={handleShowSidebar}
                    isMobile = {isMobile}
                />
                <div>
                    {
                        isMobile?
                        <Header 
                            handleShowSidebar={handleShowSidebar}
                            isMobile={isMobile}
                        />:<></>
                    }
                    <Chat 
                        handleShowSidebar={handleShowSidebar}
                        isMobile = {isMobile}
                    />    
                </div>
            </Flex>    
        </OpenaiContext.Provider>
    )
};
export default OpenAi;
export const getSide = () => {
    
}