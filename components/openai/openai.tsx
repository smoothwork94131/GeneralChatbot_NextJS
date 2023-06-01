import { useCreateReducer } from '@/hooks/useCreateReducer';
import { initialState, OpenaiInitialState } from './openai.state';
import OpenaiContext from './openai.context';
import  Chat  from '@/components/Chat';
import TimeAgo from 'react-timeago';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter'

import { 
    AppShell, 
    UnstyledButton,
    Group, 
    Drawer,
    MediaQuery,
    Text,
    createStyles,
    Box,
    rem,
    Loader, 
    Badge,
    Flex
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
import { DESTKTOP_SEACH_PREVIEW_LENGTH, MOBILE_LIMIT_WIDTH, MOBILE_SEACH_PREVIEW_LENGTH } from '@/utils/app/const';
import { useMediaQuery } from "@mantine/hooks";
import { Conversation, Role } from '@/types/chat';
import {  Input, SelectedSearch, SelectedSearchState, UtilitiesGroup, Utility } from '@/types/role';
import { saveSelctedConversation } from '@/utils/app/conversation';
import { IconSearch } from '@tabler/icons-react';
import { RoleGroup } from '../../types/role';

interface Props {
    serverRoleData: RoleGroup[]
}

const spotlightProps = {
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
    const [updateDataLoader, setUpdateDataLoader] = useState<boolean>(false);
    const [selectedRoleIndex, setSelectedRoleIndex] = useState<number>(0);
    const L10nsStrings = {
        prefixAgo: null,
        prefixFromNow: null,
        suffixAgo: '',
        suffixFromNow: '',
        seconds: '1m ago',
        minute: '1m ago',
        minutes: '%dm ago',
        hour: '1h',
        hours: '%dh ago',
        day: '1d ago',
        days: '%dd ago',
        month: '1mo',
        months: '%dmo ago',
        year: '1yr ago',
        years: '%dyr ago',
        wordSeparator: ' ',
    }
    const formatter = buildFormatter(L10nsStrings);
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
            selectedSearch,
            selectedUtilityGroup,
            selectedConversation
        },
        dispatch,
    } = contextValue;
    useEffect(()=>{
        dispatchServerRoleData(serverRoleData);
    },[]);

    const dispatchServerRoleData = async(_rolData: RoleGroup[]) => {
        const response = await fetch('/api/updated_backend', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(_rolData)
        });

        
        
        if(_rolData) {
            let selectedRolIndex = 0;
            let selectedGroupIndex = 0;
            let utilityIndex = 0;

            _rolData.map((role_item, role_index) => {
                if(role_item.name == selectedRole.name) {
                    selectedRolIndex = role_index;
                }
                role_item.utilities_group.map((group_item, gropu_index) => {
                    group_item.utilities.map((utility, utility_index) => {
                        if(utility.name == selectedUtility.name) {
                            utilityIndex = utility_index;
                            selectedGroupIndex = gropu_index;
                        }
                    })
                })
            })
            
            dispatch({
                "field": "roleGroup",
                "value": _rolData
            });
            
            dispatch({
                "field": "selectedRole",
                "value": _rolData[selectedRolIndex]
            })
            dispatch({
                "field": "selectedUtility",
                "value": _rolData[selectedRolIndex].utilities_group[selectedGroupIndex].utilities[utilityIndex]
            })
            dispatch({
                "field": "selectedUtilityGroup",
                "value": _rolData[selectedRolIndex].utilities_group
            })
        }
    }

    const updateServerRoleData = async() => {
        const response = await fetch("/api/googlesheets");
        const data = await response.json();
        dispatchServerRoleData(data);
    }

    useEffect(() => {   
        const _conversationHistory = localStorage.getItem("conversationHistory");
        if(_conversationHistory){
            const parsedConversationHistory:Conversation[] = JSON.parse(_conversationHistory);
            dispatch({
                "field": "conversationHistory",
                "value": parsedConversationHistory
            })
        }

    },[roleGroup]);
    
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
        
        setSelectedRoleIndex(index);

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
            dispatch({
                field: 'selectedSearch',
                value: SelectedSearchState
            });
        }
    };

    const handleSelectUtility = (utility_key:string) => {
        let updatedUtility: Utility[] = [];
        let updatedRole:RoleGroup ={name:'',utilities_group:[]};
        for(let r_index = 0; r_index < roleGroup.length; r_index++) {
            for(let k = 0 ; k<roleGroup[r_index].utilities_group.length; k++){
                updatedUtility = roleGroup[r_index].utilities_group[k].utilities.filter((utility) => utility.key == utility_key);
                if(updatedUtility.length > 0) { break;}
            }
            if(updatedUtility.length > 0) { 
                updatedRole = roleGroup[r_index];
                break;
                
            }
        }
        
        if(updatedUtility && updatedUtility.length > 0) {
            
            let roleGroup_ = roleGroup;
            const updatedUtility_ = updatedUtility[updatedUtility?.length - 1];

            for(let r_index = 0 ; r_index < roleGroup_.length ; r_index++) {
                if(updatedRole.name == roleGroup_[r_index].name) {            
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
                field: "selectedRole",
                value: updatedRole
            });
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
        if(isMobile)
            setOpenedSiebar(!openedSidebar);
    };
    const handleInputSearch = (event) => {
        const searchKey = event.target.value;
        const updatedHistoryActions: {
            timestamp: number;
            title: string;
            utilityKey: string;
            historyIndex: number;
            searchKey: string;
            prevText: string;
            nextText: string;
            description: string;
            roleName: string;
            inputs: Input[],
            datetime: string|undefined
        }[] = [];
        let searchHistoryActions:SpotlightAction[] = [];
        let preview_length = DESTKTOP_SEACH_PREVIEW_LENGTH;
        if(isMobile) {
            preview_length = MOBILE_SEACH_PREVIEW_LENGTH;
        }
        conversationHistory.map((conversation, conversationIndex) => {
            conversation.messages.map((messages, messagesIndex) => {
                let flag = false;
                messages.map((message, messageIndex) => {
                    const content = message.content;
                    if(!content.toLowerCase().includes(searchKey.toLowerCase()) || flag) {
                        return;
                    }
                    const searchIndex = content.toLowerCase().indexOf(searchKey.toLowerCase());
                    let prevText = ''; let nextText = '';
                    
                    if(searchIndex > preview_length) {
                        prevText = "..."+content.substr(searchIndex-preview_length, preview_length);        
                    } else {
                        prevText = content.substr(0, searchIndex);
                    }
                    if(content.length - (searchIndex + searchKey.length) > preview_length) {
                        nextText = content.substr((searchIndex + searchKey.length), preview_length)+"...";
                    } else {
                        nextText = content.substr((searchIndex + searchKey.length), content.length - (searchIndex + searchKey.length));
                        if(messageIndex == 0) {
                            if(messages[1].content.length > preview_length) {
                                nextText = nextText+"..."+messages[1].content.substr(0, 25)+"...";
                            } else {
                                nextText = nextText+"..."+messages[1].content.substr(0, messages[1].content.length-1);
                            }   
                        }
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
                        datetime: messages[0].datetime,
                        searchKey: searchKey,
                        nextText: nextText,
                        inputs: messages[0].inputs?messages[0].inputs:[],
                        prevText: prevText,
                        description: `${nextText}${searchKey}${prevText}`
                    });
                    flag = true;
                })
            })
        });   
        updatedHistoryActions.sort((a, b) => b.timestamp-a.timestamp);
        updatedHistoryActions.map((item) => {
            searchHistoryActions.push({
                title: item.title,
                utilityKey:item.utilityKey,
                searchKey: item.searchKey,
                description: item.description,
                nextText: item.nextText,
                prevText: item.prevText,
                roleName: item.roleName,
                inputs: item.inputs,
                timestamp: item.timestamp,
                datetime: item.datetime,
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
                    {
                        <Flex direction="column" gap="10px">
                            <Badge size="md" radius="sm">
                                {action.roleName}
                            </Badge>
                            <Text size="xs" align='right'>
                                <TimeAgo
                                    date={new Date(action.datetime)} 
                                    formatter={formatter} 
                                    style={{fontSize:'12px'}}
                                    locale={'en'}
                                />
                            </Text>

                        </Flex>
                    }
                </Text>
            </Group>
            </UnstyledButton>
        );
    }
    return (
        isMobile!==undefined?
            !updateDataLoader?
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
                                updateServerRoleData={updateServerRoleData}
                                selectedConversation={selectedConversation}
                                
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
                                        updateServerRoleData={updateServerRoleData}
                                    />
                                </MediaQuery>
                                <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                                    <DrawerNav 
                                        opened={openedSidebar} 
                                        handleShowSidebar={handleShowSidebar} 
                                        isMobile={isMobile}
                                        selectedSearch={selectedSearch}
                                        updateServerRoleData={updateServerRoleData}
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
            </OpenaiContext.Provider>:
            <Box sx={({
                width: '100%',
                height: '100%'
            })}>
                <Loader sx={(theme) =>({
                    position: 'absolute',
                    top: '30%',
                    left: '48%'
                })} />
            </Box>:
        <></>
    )
};

const DrawerNav: FC<{ 
    opened: boolean; 
    handleShowSidebar: () => void; 
    isMobile: boolean;
    selectedSearch: SelectedSearch,
    updateServerRoleData: ()=>void;
}> = ({
    opened,
    handleShowSidebar,
    selectedSearch,
    updateServerRoleData
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
            updateServerRoleData={updateServerRoleData}
        />
      </Drawer>
    );
};



export default OpenAi;
