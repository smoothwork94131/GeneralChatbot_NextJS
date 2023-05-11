import { useContext, FC } from 'react';
import { Box } from '@mantine/core';
import  Role  from "@/components/Role";
import ChatContent from './ChatContent';
import OpenaiContext from '@/components/openai/openai.context';
import { Conversation } from '@/types/chat';
import {
    saveConversationHistory,
    saveSelctedConversation,
} from '@/utils/app/conversation';

interface Props {
    isMobile: boolean;  
    handleShowSidebar: ()=>void
}

const Chat:FC<Props> = ({isMobile, handleShowSidebar}) => {
    const {
        state: { 
            roleGroup, 
            selectedUtility, 
            selectedRole, 
            conversationHistory,
            selectedConversation,
        },
        handleSelectRole,
        dispatch: openaiDispatch
    } = useContext(OpenaiContext);
    
    const handleChangeUtilityInputsValue = (input_index: number, value: string) => {
        let t_utility = selectedUtility;
        t_utility.inputs[input_index].value = value;
        console.log("handle", selectedConversation);
        openaiDispatch({
            field: "selectedUtility",
            value: t_utility
        });
    };
    
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
                <Role 
                    handleSelectRole = {handleSelectRole}
                    roleGroup = {roleGroup}
                    selectedRole = {selectedRole}
                    isMobile = {isMobile}
                />:<></>
            }
            
            <ChatContent
                selectedUtility={selectedUtility}
                handleChangeUtilityInputsValue = {handleChangeUtilityInputsValue}
                selectedConversation={selectedConversation}
                saveSelectConverSation={saveSelectConverSation}
                conversationHistory={conversationHistory}
                isMobile={isMobile}
            />
        </Box>
    )
}
export default Chat;