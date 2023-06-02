import { useContext, FC, useEffect } from 'react';
import { Box, Flex, Text } from '@mantine/core';
import  Role  from "@/components/Role";
import ChatContent from './ChatContent';
import OpenaiContext from '@/components/openai/openai.context';
import { Conversation } from '@/types/chat';
import {
    saveConversationHistory,
    saveSelctedConversation,
} from '@/utils/app/conversation';
import { SelectedSearch, SelectedSearchState, Utility, UtilityState } from '@/types/role';
import AccountButtons from '@/components/Account/AccountButtons';

interface Props {
    isMobile: boolean;  
    handleShowSidebar: ()=>void;
    selectedSearch: SelectedSearch;
}

const Chat:FC<Props> = ({isMobile,
    selectedSearch,
}) => {
    const {
        state: { 
            roleGroup, 
            selectedUtility, 
            selectedRole, 
            conversationHistory,
            selectedConversation,
            messageIsStreaming
        },
        handleSelectRole,
        dispatch: openaiDispatch
    } = useContext(OpenaiContext);
    
    const handleChangeUtilityInputsValue = (input_index: number, value: string) => {
        let t_utility: Utility = UtilityState;

        t_utility = selectedUtility;
        t_utility.inputs[input_index].value = value;
        
        openaiDispatch({
            field: "selectedUtility",
            value: t_utility
        });
    };
    const clearSelectedSearch = () => {
        openaiDispatch({
            "field": "selectedSearch",
            "value": SelectedSearchState
        })
    }
    
    const setMessageIsStreamming = (type: boolean) => {
        openaiDispatch({
            "field":"messageIsStreaming",
            "value":type
        })
    }
    const saveSelectConverSation = (conversation: Conversation) => {
        
        saveSelctedConversation(conversation);
        openaiDispatch({
            "field": "selectedConversation",
            "value": conversation
        });
        
        let exist = false;
        let updatedHistory = conversationHistory.map((item, index) => {
            if(item.key == conversation.key) {
                exist= true;
                return conversation;
            } else{
                return item;
            }
        });
        
        if(!exist) {
            updatedHistory.push(conversation);
        }
        
        saveConversationHistory(updatedHistory);
        openaiDispatch({
            "field":"conversationHistory",
            "value": updatedHistory
        });
    }
    const deleteConversation = (index: number) => {
        // let updatedConversation:Conversation = JSON.parse(JSON.stringify(selectedConversation));
        let updatedConversation:Conversation = {...selectedConversation, messages: selectedConversation.messages.slice()}
        updatedConversation.messages.splice(index, 1);
        saveSelectConverSation(updatedConversation);
    }
    return (
        <Box  
            sx={(theme) =>({
                flex: 'display',
                height: '100%',
                width: '100%',
                zIndex: 0,
                flexDirection: 'column'
            })}
        >
            {
                !isMobile?
                <Flex
                    align='center'
                    justify='space-between'
                >
                    <Role 
                        handleSelectRole = {handleSelectRole}
                        roleGroup = {roleGroup}
                        selectedRole = {selectedRole}
                        isMobile = {isMobile}
                    />
                    <AccountButtons 
                        selectedConversation={selectedConversation}
                        isMobile={isMobile}
                    />
                </Flex>:<></>
            }
            <ChatContent
                selectedUtility={selectedUtility}
                handleChangeUtilityInputsValue = {handleChangeUtilityInputsValue}
                selectedConversation={selectedConversation}
                saveSelectConverSation={saveSelectConverSation}
                conversationHistory={conversationHistory}
                isMobile={isMobile}
                selectedSearch={selectedSearch}
                clearSelectedSearch={clearSelectedSearch}
                deleteConversation={deleteConversation}
                messageIsStreaming={messageIsStreaming}
                setMessageIsStreamming={setMessageIsStreamming}
            />
            {/* <Text ta="center"
                sx={(theme) => ({
                    fontSize: theme.fontSizes.xs,
                    flexGrow: 1
                })} 
            >   
                ChatGPT Mar 23 version. Free Research Preview. ChatGPT may produce inaccurate information about people, places, or facts.
            </Text> */}
        </Box>
    )
}
export default Chat;