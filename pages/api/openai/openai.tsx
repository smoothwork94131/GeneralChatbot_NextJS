import { useCreateReducer } from '@/hooks/useCreateReducer';
import { initialState, OpenaiInitialState } from './openai.state';
import OpenaiContext from './openai.context';
import  SideBar  from '@/components/Sidebar';
import { useContext } from 'react';
import  Chat  from '@/components/Chat';
import { AppShell, Header, Navbar } from '@mantine/core';
import { ROLE_GROUP } from '@/utils/app/const';
import { useEffect, useState } from 'react';
import OpenAiHeader from '@/components/Header';
import { MOBILE_LIMIT_WIDTH } from '@/utils/app/const';
import HomeContext from '@/pages/index.context';
interface Props {

}
const OpenAi = ({
    
}: Props) => {
    
    const [isMobile, setIsMobile] = useState(false);
    const [openedSidebar, setOpenedSiebar] = useState(false);

    const contextValue = useCreateReducer<OpenaiInitialState>({
        initialState,
    });
    const {
        state: {
            selectedRole
        },
        dispatch,
    } = contextValue;

    const {
        state: { colorScheme },
    } = useContext(HomeContext) ;

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
        setOpenedSiebar(false);
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
        } else {
            setIsMobile(false);
        }
    }
    const handleShowSidebar = () => {
        setOpenedSiebar(!openedSidebar);
    };

    return (
        <OpenaiContext.Provider
            value={{
                ...contextValue,
                handleSelectRole,
                handleSelectUtility       
            }}
        >
            <AppShell
                navbarOffsetBreakpoint="sm"
                asideOffsetBreakpoint="sm"
                header = {
                    isMobile?
                    <Header height={{ base: 40}} bg={
                        colorScheme == 'light'?'#EFEFEF':''}
                        zIndex={10000000000000}
                    >
                        <OpenAiHeader 
                            handleShowSidebar={handleShowSidebar}
                            openedSidebar={openedSidebar}
                            isMobile={isMobile}
                        />
                    </Header>:<></>
                }
                navbar={
                    <Navbar
                        hiddenBreakpoint="sm" hidden={!openedSidebar} 
                        width={{ sm: openedSidebar ? 300 : 300 }}
                        sx={{
                            overflow: "hidden",
                            transition: "width 1000ms ease, min-width 1000ms ease"
                        }}
                    >
                        <SideBar
                            handleShowSidebar={handleShowSidebar}
                            isMobile = {openedSidebar}
                        />
                    </Navbar>
                }
            >  
                <Chat 
                    handleShowSidebar={handleShowSidebar}
                    isMobile = {isMobile}
                />    
            </AppShell>
        </OpenaiContext.Provider>
    )
};
export default OpenAi;
export const getSide = () => {
    
}