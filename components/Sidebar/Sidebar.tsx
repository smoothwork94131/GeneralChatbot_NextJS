import { FC, useContext} from 'react';
import Search from '@/components/Search';
import Utils from '@/components/Utils';
import Settings from '@/components/Settings';
import OpenaiContext from '@/pages/api/openai/openai.context';
import { useDisclosure } from "@mantine/hooks";
import { Navbar,
    createStyles,
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
            p="md"
            pt="lg"
            className={cx(classes.navbar, className)}
        >
            {
                isMobile?
                <Flex
                    align='center'
                    gap='md'
                    mt={5}
                >
                    <Search />
                    <IconArrowLeft 
                        onClick={handleShowSidebar}
                    />
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