import { FC, useContext } from 'react';
import { Flex, Menu, NavLink  } from '@mantine/core';
import { IconLogin, IconLogout, IconMoon, IconSearch, IconShoppingBag, IconStar, IconSun, IconTrash, IconUrgent, IconWorld } from '@tabler/icons-react';
import { spotlight } from '@mantine/spotlight';
import HomeContext from 'state/index.context';
import { useUser } from '@/utils/app/useUser';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { supabase } from '@/utils/app/supabase-client';

interface Props {
    isMobile: boolean;
    updateServerRoleData:() =>void;
}
const Settings:FC<Props> = ({isMobile, updateServerRoleData}) =>{
    
    const { user } = useUser();
    const router = useRouter();

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
        localStorage.setItem("colorScheme", colorScheme == 'dark'? 'light':'dark');
    }
    const goLogin = async () => {
        if(user) {
            await supabase.auth.signOut();
        } else {
            window.location.href='/signin';
        }
    }
    const goPricingPage = async () => {
        if(user) {
            window.location.href='/pricing';
        } else {
            window.location.href='/signin';
        }
    }
    return (
        isMobile?
        <Menu.Dropdown>
            <Menu.Item
                icon={<IconStar size={14} />}
            >
                Favourited charts
            </Menu.Item>
            <Menu.Item
                icon={<IconTrash size={14} />}
            >
                Clear Conversation
            </Menu.Item>
            <Menu.Item 
                icon={
                    colorScheme == "dark"?<IconSun size={14}/>:<IconMoon size={14}/>
                }
                onClick={handleColorScheme}
            >
                {colorScheme == "dark"?"Light":"Dark"}
            </Menu.Item>
            <Menu.Item 
                icon={<IconSearch size={14} />}
                onClick={() => {spotlight.open()}}
            >
                Search History
            </Menu.Item>
            <Menu.Item
                icon={<IconWorld size={14} />}
                onClick = {() => {updateServerRoleData()}}
            >
                Updates & FAQ
            </Menu.Item>
            
            <Menu.Item
                icon={<IconShoppingBag size={14} />}
                onClick={() => {goPricingPage()}}
            >
                Pricing
            </Menu.Item>    
            <Menu.Item
                icon={user?<IconLogout size={14}/>:<IconLogin size={14} />}
                onClick={()=>goLogin()}
            >
                {
                    user?'Sign out':'Sign in'
                }
            </Menu.Item>
           
            
        </Menu.Dropdown>:
        <Flex
            mih={50}
            justify="flex-start"
            align="flex-start"
            direction="column"
            wrap="wrap"
            sx={(theme)=>({
                borderTop: `1px solid ${theme.colorScheme == 'dark'? theme.colors.gray[8]: theme.colors.gray[1]}`,
                paddingTop: theme.spacing.md
            })}
        >

            <NavLink
                label="Favourited charts"
                icon={<IconStar size="1rem" stroke={1.5} />}
                variant="subtle"            
            />

            <NavLink
                label="Clear Conversation"
                icon={<IconTrash size="1rem" stroke={1.5} />}
                variant="subtle"            
            />
            <NavLink
                label={`${colorScheme == "dark"?"Light":"Dark"}`}
                icon={colorScheme == "dark"?<IconSun size="1rem" stroke={1.5} />:<IconMoon size="1rem" stroke={1.5}/>}
                variant="subtle"          
                onClick={handleColorScheme}  
            />
            <NavLink
                label="Search Hitory"
                icon={<IconSearch size="1rem" stroke={1.5} />}
                variant="subtle"    
                onClick={() => {spotlight.open()}}
            />
            <NavLink
                label="Updates & FAQ"
                icon={<IconWorld size="1rem" stroke={1.5} />}
                variant="subtle"           
                onClick = {() => {updateServerRoleData()}}
            />
            <NavLink
                label="Pricing"
                icon={<IconShoppingBag size="1rem" stroke={1.5} />}
                variant="subtle" 
                onClick={()=>{window.location.href='/pricing'}}          
            />
            <NavLink
                label={
                    user?'Sign out':'Sign in'
                }
                icon={user?<IconLogout size="1rem" stroke={1.5} />:<IconLogin size="1rem" stroke={1.5} />}
                variant="subtle"      
                onClick={()=>goLogin()}      
            />
        </Flex> 
    )
}

export default Settings;
