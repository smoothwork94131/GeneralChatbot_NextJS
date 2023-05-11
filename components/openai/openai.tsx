import { useCreateReducer } from '@/hooks/useCreateReducer';
import { initialState, OpenaiInitialState } from './openai.state';
import OpenaiContext from './openai.context';
import  Chat  from '@/components/Chat';
import { 
    AppShell, 
    Drawer,
    MediaQuery,
} from '@mantine/core';
import { 
    useEffect, 
    useState, 
    FC
 } from 'react';

import Sidebar from '@/components/Sidebar/Sidebar';
import { useRouter } from "next/router";
import OpenAiHeader from '@/components/Header';
import { MOBILE_LIMIT_WIDTH } from '@/utils/app/const';
import { useMediaQuery } from "@mantine/hooks";
import { Conversation } from '@/types/chat';
import {  Utility } from '@/types/role';
import { saveSelctedConversation } from '@/utils/app/conversation';

interface Props {

}

const OpenAi = ({
    
}: Props) => {
    
    const [openedSidebar, setOpenedSiebar] = useState(false);
    const isMobile = useMediaQuery(`(max-width: ${MOBILE_LIMIT_WIDTH}px)`);
    const contextValue = useCreateReducer<OpenaiInitialState>({
        initialState,
    });
    const {
        state: {
            selectedRole,
            roleGroup,
            conversationHistory,
            selectedUtility
        },
        dispatch,
    } = contextValue;

    useEffect(() => {   
        const _conversationHistory = localStorage.getItem("conversationHistory");
        if(_conversationHistory){
            const parsedConversationHistory:Conversation[] = JSON.parse(_conversationHistory);
            dispatch({
                "field": "conversationHistory",
                "value": parsedConversationHistory
            })
        }
    },[]);
    
    useEffect(() => {
        let updatedConversation:Conversation;
        const filterConversation = conversationHistory.filter(item => item.key == selectedUtility.key);
        if(filterConversation.length > 0 ) {
            updatedConversation = filterConversation[0]
        } else {
            updatedConversation = {
                name: selectedUtility.name,
                key: selectedUtility.key,
                messages:[]
            };
        }
        saveSelctedConversation(updatedConversation);    
        dispatch({
            "field": "selectedConversation",
            "value":updatedConversation
        });
        
    },[selectedUtility, conversationHistory]);
    
    const handleSelectRole = (index: number) => {
        const updatedRole = roleGroup.filter(
            (r, r_index) => r_index == index
        );
        
        if(updatedRole.length > 0) {
            let utility;
            for(let g_index = 0; g_index < roleGroup[index].utilities_group.length; g_index++){
                for(let u_index = 0; u_index < roleGroup[index].utilities_group[g_index].utilities.length; u_index++) {
                    if(roleGroup[index].utilities_group[g_index].utilities[u_index].active){
                        utility = roleGroup[index].utilities_group[g_index].utilities[u_index];
                    }
                }
            }
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
                value: utility
            });
        }
    };
    const handleSelectUtility = (utility_key:string) => {
        let updatedUtility: Utility[] = [];
        for(let k = 0 ; k<selectedRole?.utilities_group.length; k++){
            updatedUtility = selectedRole?.utilities_group[k].utilities.filter((utility) => utility.key == utility_key);
            if(updatedUtility.length > 0) break;
        }
        
        if(updatedUtility && updatedUtility.length > 0) {
            
            let roleGroup_ = roleGroup;
            const updatedUtility_ = updatedUtility[updatedUtility?.length - 1];
            
            for(let r_index = 0 ; r_index < roleGroup_.length ; r_index++) {
                if(selectedRole.name == roleGroup_[r_index].name) {            
                    for(let g_index = 0 ; g_index <roleGroup_[r_index].utilities_group.length; g_index++) {
                        for(let u_index = 0 ; u_index < roleGroup_[r_index].utilities_group[g_index].utilities.length; u_index++){
                            if(updatedUtility_.key == roleGroup_[r_index].utilities_group[g_index].utilities[u_index].key 
                                ) {
                                roleGroup_[r_index].utilities_group[g_index].utilities[u_index].active = true;
                            } else{
                                roleGroup_[r_index].utilities_group[g_index].utilities[u_index].active = false;
                            }
                        }
                    }
                }    
            }

            dispatch({
                field: "selectedUtility",
                value: updatedUtility_
            })
            dispatch({
                field: "roleGroup",
                value: roleGroup_
            })
        }  
        setOpenedSiebar(false);
    };
    const handleShowSidebar = () => {
        setOpenedSiebar(!openedSidebar);
    };
    return (
        isMobile!==undefined?
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
                    <OpenAiHeader
                        handleShowSidebar={handleShowSidebar}
                        openedSidebar={openedSidebar}
                        isMobile={isMobile}
                    />:<></>
                }
                navbar={
                    <>
                        <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
                            <Sidebar
                                handleShowSidebar={handleShowSidebar}
                                isMobile = {isMobile}
                                openedSidebar={openedSidebar}
                            />
                        </MediaQuery>
                        <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                            <DrawerNav 
                                opened={openedSidebar} 
                                handleShowSidebar={handleShowSidebar} 
                                isMobile={isMobile}
                            />
                        </MediaQuery>
                    </>
                }
            >  
                <Chat 
                    handleShowSidebar={handleShowSidebar}
                    isMobile = {isMobile}
                />    
            </AppShell>
        </OpenaiContext.Provider>:<></>
    )
};

const DrawerNav: FC<{ opened: boolean; handleShowSidebar: () => void; isMobile: boolean; }> = ({
    opened,
    handleShowSidebar,
  }) => {
    const router = useRouter();
    useEffect(() => {
      router.events.on("routeChangeStart", handleShowSidebar);
      return () => {
        router.events.off("routeChangeStart", handleShowSidebar);
      };
    }, [handleShowSidebar, router.events]);
    
    return (
      <Drawer
        opened={opened}
        onClose={handleShowSidebar}
        size="auto"
        withCloseButton={false}
        sx={{ position: "relative" }}
      >
        <Sidebar 
            handleShowSidebar={handleShowSidebar}
            isMobile={true} 
            openedSidebar={opened}
        />
      </Drawer>
    );
};
export default OpenAi;
export const getSide = () => {
    
}