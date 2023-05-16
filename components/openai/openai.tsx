import { useCreateReducer } from '@/hooks/useCreateReducer';
import { initialState, OpenaiInitialState } from './openai.state';
import OpenaiContext from './openai.context';
import  Chat  from '@/components/Chat';
import { getEmojiList } from '@/lib/googlesheets';

import { 
    AppShell, 
    UnstyledButton,
    Group, 
    Drawer,
    MediaQuery,
    Text,
    createStyles,
    Box,
    rem
} from '@mantine/core';
import { 
    useEffect, 
    useState, 
    FC,
 } from 'react';
import { SpotlightProvider, SpotlightAction, SpotlightActionProps  } from '@mantine/spotlight';
import Sidebar from '@/components/Sidebar/Sidebar';
import { useRouter } from "next/router";
import OpenAiHeader from '@/components/Header';
import { MOBILE_LIMIT_WIDTH } from '@/utils/app/const';
import { useMediaQuery } from "@mantine/hooks";
import { Conversation } from '@/types/chat';
import {  SelectedSearch, UtilitiesGroup, Utility } from '@/types/role';
import { saveSelctedConversation } from '@/utils/app/conversation';
import { IconSearch } from '@tabler/icons-react';
import { RoleGroup } from '../../types/role';

interface Props {
    serverRoleData: RoleGroup[]
}

const spotlightProps = {
    /* Props for your Spotlight component go here */
    styles: {
        window: {
        maxWidth: '1000px',
        margin: '0 auto'
      }
    }
};

const OpenAi = ({
    serverRoleData
}: Props) => {
    const [openedSidebar, setOpenedSiebar] = useState(false);
    const isMobile = useMediaQuery(`(max-width: ${MOBILE_LIMIT_WIDTH}px)`);
    const [searchHistory, setSearchHistory] = useState<SpotlightAction[]>([]);

    const contextValue = useCreateReducer<OpenaiInitialState>({
        initialState,
    });

    const useStyles = createStyles((theme) => ({
        action: {
          position: 'relative',
          display: 'block',
          width: '100%',
          borderRadius: theme.radius.sm,
          padding: `${rem(10)} ${rem(12)}`,
          ...theme.fn.hover({
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[1],
          }),
      
          '&[data-hovered]': {
            backgroundColor: theme.colors.blue,
            color: theme.colors.white
          },
        },
      }));
    
    const {
        state: {
            selectedRole,
            roleGroup,
            conversationHistory,
            selectedUtility,
            selectedSearch
        },
        dispatch,
    } = contextValue;

    useEffect(() => {   
        
        getServiceGroupData();
        const _conversationHistory = localStorage.getItem("conversationHistory");
        if(_conversationHistory){
            const parsedConversationHistory:Conversation[] = JSON.parse(_conversationHistory);
            dispatch({
                "field": "conversationHistory",
                "value": parsedConversationHistory
            })
        }
    },[]);

    const getServiceGroupData = async() => {
        const res = await fetch('/api/googlesheets');
        console.log("server_render",res);
    }

    useEffect(() => {
        let updateConversation:Conversation;
        const filterConversation = conversationHistory.filter(item => item.key == selectedUtility.key);
        if(filterConversation.length > 0 ) {
            updateConversation = filterConversation[0]
        } else {
            updateConversation = {
                name: selectedUtility.name,
                key: selectedUtility.key,
                messages:[]
            };
        }
        saveSelctedConversation(updateConversation);    
        dispatch({
            "field": "selectedConversation",
            "value":updateConversation
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
    const handleInputSearch = (event) => {
        const searchKey = event.target.value;
        const updatedHistoryActions: {
            timestamp: number;
            title: string;
            utilityKey: string;
            roleName: string;
            historyIndex: number;
            searchKey: string;
            prevText: string;
            nextText: string;
            description: string;
        }[] = [];
        let searchHistoryActions:SpotlightAction[] = [];
        
        conversationHistory.map((conversation, conversationIndex) => {
            conversation.messages.map((messages, messagesIndex) => {
                messages.map((message, messageIndex) => {
                    const content = message.content;
                    if(!content.toLowerCase().includes(searchKey.toLowerCase())) {
                        return;
                    }
                    const searchIndex = content.toLowerCase().indexOf(searchKey.toLowerCase());
                    let prevText = ''; let nextText = '';
                    
                    if(searchIndex > 25) {
                        prevText = "..."+content.substr(searchIndex-25, 25);        
                    } else {
                        prevText = content.substr(0, searchIndex);
                    }   
                    if(content.length - (searchIndex + searchKey.length) > 25) {
                        nextText = content.substr((searchIndex + searchKey.length), 25)+"...";
                    } else {
                        nextText = content.substr((searchIndex + searchKey.length), content.length - (searchIndex + searchKey.length));
                    }
                    let timestamp: Date = new Date() ;
                    if(messages[0].datetime) {
                        timestamp = new Date(messages[0].datetime)
                    }
                    const splitKey = conversation.key.split("_");
                    updatedHistoryActions.push({
                        title: `${splitKey[1]} > ${splitKey[2]}`,
                        roleName: splitKey[0],
                        historyIndex: messagesIndex,
                        utilityKey: conversation.key,
                        timestamp: Math.floor(timestamp.getTime()/1000),
                        searchKey: searchKey,
                        nextText: nextText,
                        prevText: prevText,
                        description: `${nextText}${searchKey}${prevText}`
                    });
                })
            })
        });   
        updatedHistoryActions.sort((a, b) => b.timestamp-a.timestamp);
        updatedHistoryActions.map((item) => {
            searchHistoryActions.push({
                title: item.title,
                utilityKey:item.utilityKey,
                roleName: item.roleName,
                searchKey: item.searchKey,
                description: item.description,
                nextText: item.nextText,
                prevText: item.prevText,
                onTrigger: () => {
                    onTriggarSearch(item.utilityKey, item.historyIndex)
                },
            })
        })
        setSearchHistory(searchHistoryActions);
    }
    
    const onTriggarSearch = (utilityKey: string, messagesIndex: number) => {
        const utilityInfo = utilityKey.split("_");
        const searchRoleName:string = utilityInfo[0]; const searchUtilityGroupName:string = utilityInfo[1]; const searchUtilityName:string = utilityInfo[2];

        roleGroup.map((role:RoleGroup) => {
            if(role.name == searchRoleName) {
                dispatch({
                    "field":"selectedRole",
                    "value": role
                });
                dispatch({
                    "field": "selectedUtilityGroup",
                    "value": role.utilities_group
                });
                role.utilities_group.map((utility_group) => {
                    if(utility_group.name == searchUtilityGroupName) {
                        utility_group.utilities.map((utility) => {
                            if(utility.name == searchUtilityName) {
                                dispatch({
                                    "field": "selectedUtility",
                                    "value": utility
                                })
                            }
                        })
                    }
                })
            }
        })
        setSearchHistory([]);
        dispatch({
            "field": "selectedSearch",
            value: {
                utility_key: utilityKey,
                history_index: messagesIndex
            }
        });
    }
    
    function  CustomSplitlightAction({
        action,
        styles,
        classNames,
        hovered,
        onTrigger,
        ...others
      }: SpotlightActionProps) {
        const { classes } = useStyles(undefined, { styles, classNames, name: 'Spotlight' });

        return (
            <UnstyledButton
                className={classes.action}
                data-hovered={hovered || undefined}
                tabIndex={-1}
                onMouseDown={(event) => event.preventDefault()}
                onClick={onTrigger}
                {...others}
            >
            <Group noWrap>
                <Box style={{ flex: 1 }}>
                    <Text color={`${hovered?'white':'dimmed'}`}>{action.title}</Text>
                    {
                        <Text color={`${hovered?'white':'dimmed'}`} size="sm">
                            {
                                action.prevText
                            }
                            <span style={{background: 'orange', color: 'black'}}>
                                {action.searchKey}
                            </span>
                            {action.nextText}
                        </Text>
                    }    
                </Box>
                <Text color={`${hovered?'white':'dimmed'}`}>
                    [{action.roleName}]
                </Text>
            </Group>
            </UnstyledButton>
        );
    }
    return (
        isMobile!==undefined?
        <OpenaiContext.Provider
            value={{
                ...contextValue,
                handleSelectRole,
                handleSelectUtility       
            }}
        >
            <SpotlightProvider
                actions={searchHistory}
                searchIcon={<IconSearch size="1.2rem" />}
                searchPlaceholder="Search..."
                shortcut="mod + shift + 1"
                nothingFoundMessage="Nothing found..."
                onChange={handleInputSearch}
                actionComponent={CustomSplitlightAction}
                highlightQuery
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
                                    selectedSearch={selectedSearch}
                                />
                            </MediaQuery>
                            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                                <DrawerNav 
                                    opened={openedSidebar} 
                                    handleShowSidebar={handleShowSidebar} 
                                    isMobile={isMobile}
                                    selectedSearch={selectedSearch}
                                />
                            </MediaQuery>
                        </>
                    }
                >  
                    <Chat 
                        handleShowSidebar={handleShowSidebar}
                        isMobile = {isMobile}
                        selectedSearch={selectedSearch}
                    />    
                </AppShell>
            </SpotlightProvider>
        </OpenaiContext.Provider>:<></>
    )
};

const DrawerNav: FC<{ 
    opened: boolean; 
    handleShowSidebar: () => void; 
    isMobile: boolean;
    selectedSearch: SelectedSearch 
}> = ({
    opened,
    handleShowSidebar,
    selectedSearch
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
            selectedSearch={selectedSearch}
        />
      </Drawer>
    );
};

export default OpenAi;
export async function getStaticProps(context) {
    const response = await fetch('/api/googlesheets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
    });

    const roleData = await getEmojiList();
    console.log("rolData", roleData);
    return {
        props: {
          serverRoleGroup: response
        },
        revalidate: 1, // In seconds
    };
}