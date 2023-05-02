import { FC, useContext} from 'react';
import Search from '@/components/Search';
import Utils from '@/components/Utils';
import Settings from '@/components/Settings';
import OpenaiContext from '@/pages/api/openai/openai.context';
import { useDisclosure } from "@mantine/hooks";
import { 
    Navbar,
    createStyles,
    Text,
    Flex
 } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';

interface Props {
    isMobile: boolean
    handleShowSidebar:() => void;
    openedSidebar: boolean;
    className?:string;
}

const useStyles = createStyles<string, { collapsed?: boolean }>(
    (theme, params, getRef) => {
        console.log(params);
      return {
        navbar: {
          position: "sticky",
          top: 0,
          width: params?.collapsed ? 81 : 264,
          transition: params?.collapsed ? "width 0.1s linear" : "none",
        },
        footer: {
            paddingTop: theme.spacing.xs,
            marginTop: theme.spacing.md,
            borderTop: `1px solid ${theme.colors.gray[2]}`,
        },
      };
    }
);
const Sidebar: FC<Props> = ({isMobile, className, handleShowSidebar}) =>{
    const {
        state: { selectedUtilityGroup, selectedUtility },
        handleSelectUtility,
    } = useContext(OpenaiContext);
    const [collapsed, handlers] = useDisclosure(false);
    const { classes, cx } = useStyles({ collapsed });
    return (
        <Navbar 
            sx={(theme) => ({
                padding: theme.spacing.sm
            })}
            className={cx(classes.navbar, className)}
        >
           
            {
                isMobile?
                <Flex 
                    gap='sm'
                    align='center'
                >
                    <Search />
                    <Text sx={(theme) => ({
                            color: theme.colors.gray[7]
                        })}>
                        <IconArrowLeft 
                            onClick={handleShowSidebar}  
                        />        
                    </Text>
                </Flex>:
                <Search />
            }
            <Utils 
                selectedUtilityGroup = { selectedUtilityGroup }
                handleSelectUtility = {handleSelectUtility}
                selectedUtility = {selectedUtility}
            />
            {
                !isMobile?
                <Settings isMobile={isMobile}/>:<></>
            }
        </Navbar>
    )
}
export default Sidebar; 