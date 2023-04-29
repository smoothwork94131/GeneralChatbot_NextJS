import { FC, useContext } from 'react';
import { Flex, ColorScheme } from '@mantine/core';
import { IconLogout, IconMoon, IconStar, IconSun, IconTrash, IconUrgent, IconWorld } from '@tabler/icons-react';
import SettingButton from './SettingButton';
import HomeContext from '@/pages/index.context';

interface Props {
    isMobile: boolean;
}
const Settings:FC<Props> = ({isMobile}) =>{
    const {
        state: { colorScheme, lightMode },
        dispatch: homeDispatch,
    } = useContext(HomeContext);

    const handleColorScheme = () => {
        homeDispatch({
          field: "colorScheme",
          value: colorScheme == 'dark'? 'light':'dark'
        });
        homeDispatch({
          field: "lightMode",
          value: lightMode == 'dark'? 'light':'dark'
        });
    }
    return (
        <div className={
                `${!isMobile?'p-2 space-y-2 border-t-[1px] border-solid border-gray-400 m-t-1':''}`}>
            <Flex
                mih={50}
                justify="flex-start"
                align="flex-start"
                direction="column"
                wrap="wrap"
            >
                <SettingButton 
                    icon={<IconStar />}
                    text="Favourited charts"
                    onClick={()=>{}}
                />
                <SettingButton 
                    icon={<IconTrash />}
                    text=" Clear Conversation"
                    onClick={()=>{}}
                />
                <SettingButton 
                    icon={
                        colorScheme == "dark"?<IconSun />:<IconMoon />
                    }
                    text={`${colorScheme == "dark"?"Light":"Dark"}`}
                    onClick={handleColorScheme}
                />
                <SettingButton 
                    icon={<IconWorld />}
                    text="Updates & FAQ"
                    onClick={()=>{}}
                />
                <SettingButton 
                    icon={<IconLogout />}
                    text=" Log out"
                    onClick={()=>{}}
                />
            </Flex> 
        </div>
    )
}

export default Settings;
