import { FC, useContext } from 'react';
import Search from '@/components/Search';
import Utils from '@/components/Utils';
import Settings from '@/components/Settings';
import OpenaiContext from '@/pages/api/openai/openai.context';

const Sidebar: FC = () =>{
    const {
        state: { selectedUtilityGroup, selectedUtility },
        handleSelectUtility,
    } = useContext(OpenaiContext);
    return (
        <div className="p-2 pt-2 flex flex-col w-[380px] h-screen">
            <Search />
            <Utils 
                selectedUtilityGroup = { selectedUtilityGroup }
                handleSelectUtility = {handleSelectUtility}
                selectedUtility = {selectedUtility}
            />
            <Settings 
            />
        </div>  
    )
}
export default Sidebar;