import { useContext } from 'react';
import  Role  from "@/components/Role";
import ChatMessage from './ChatMessage';
import OpenaiContext from '@/pages/api/openai/openai.context';
const Chat = () => {
    const {
        state: { roleGroup, selectedUtility, selectedRole, translateFrom, translateTo },
        handleSelectRole,
        dispatch: openaiDispatch
    } = useContext(OpenaiContext);
    
    return (
        <div className="p-7 pt-2 flex flex-col w-100 h-screen w-full">
            <Role 
                handleSelectRole = {handleSelectRole}
                roleGroup = {roleGroup}
                selectedRole = {selectedRole}
            />
            <ChatMessage 
                selectedUtility={selectedUtility}
                translateFrom = {translateFrom}
                translateTo = {translateTo}
            />
        </div>
    )
}
export default Chat;