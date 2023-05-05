import { useContext, FC } from 'react';
import { Box } from '@mantine/core';
import  Role  from "@/components/Role";
import ChatMessage from './ChatMessage';
import OpenaiContext from '@/pages/api/openai/openai.context';
interface Props {
    isMobile: boolean;  
    handleShowSidebar: ()=>void
}
const Chat:FC<Props> = ({isMobile, handleShowSidebar}) => {
    const {
        state: { roleGroup, selectedUtility, selectedRole},
        handleSelectRole,
        dispatch: openaiDispatch
    } = useContext(OpenaiContext);
    
    const handleChangeUtilityInputsValue = (input_index: number, value: string) => {
        let t_utility = selectedUtility;
        t_utility.inputs[input_index].value = value;
        openaiDispatch({
            field: "selectedUtility",
            value: t_utility
        });
    };
    return (
        <Box  
            sx={(theme) =>({
                paddingLeft: theme.spacing.md,
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
            
            <ChatMessage 
                selectedUtility={selectedUtility}
                handleChangeUtilityInputsValue = {handleChangeUtilityInputsValue}
            />
        </Box>
    )
}
export default Chat;