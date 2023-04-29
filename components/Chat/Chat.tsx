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
        state: { roleGroup, selectedUtility, selectedRole, showSidebar },
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
        <div className={`p-7 pt-2 flex flex-col w-100 h-screen w-full z-0 
            ${isMobile && showSidebar?'opacity-[0.2]':''}`}   
        >
            {
                !isMobile?
                <Role 
                    handleSelectRole = {handleSelectRole}
                    roleGroup = {roleGroup}
                    selectedRole = {selectedRole}
                    handleShowSidebar={handleShowSidebar}
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