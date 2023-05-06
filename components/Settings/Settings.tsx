import { FC, useContext } from 'react';
import { Flex, Menu, NavLink  } from '@mantine/core';
import { IconLogout, IconMoon, IconStar, IconSun, IconTrash, IconUrgent, IconWorld } from '@tabler/icons-react';
import HomeContext from 'state/index.context';

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
                icon={<IconWorld size={14} />}
            >
                Updates & FAQ
            </Menu.Item>
            <Menu.Item
                icon={<IconLogout size={14}/>}
                onClick={()=>{}}
            >
                Log out
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
                label="Updates & FAQ"
                icon={<IconWorld size="1rem" stroke={1.5} />}
                variant="subtle"            
            />
            <NavLink
                label="Log out"
                icon={<IconLogout size="1rem" stroke={1.5} />}
                variant="subtle"            
            />
        </Flex> 
    )
}

export default Settings;
