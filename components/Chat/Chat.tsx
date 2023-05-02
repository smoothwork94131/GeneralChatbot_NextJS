import { useContext, FC } from 'react';
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
        <div className={`pl-3 flex flex-col h-screen w-full z-0`}   
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
        </div>
    )
}
export default Chat;