import { useCreateReducer } from '@/hooks/useCreateReducer';
import { initialState, OpenaiInitialState } from './openai.state';
import OpenaiContext from './openai.context';
import { useContext } from 'react';
import  Chat  from '@/components/Chat';
import { 
    AppShell, 
    Drawer,
    MediaQuery,
} from '@mantine/core';
import { ROLE_GROUP } from '@/utils/app/const';
import { 
    useEffect, 
    useState, 
    FC
 } from 'react';
import { useRouter } from "next/router";
import OpenAiHeader from '@/components/Header';
import { MOBILE_LIMIT_WIDTH } from '@/utils/app/const';
import dynamic from "next/dynamic";
import { useMediaQuery } from "@mantine/hooks";

interface Props {

}
const OpenAi = ({
    
}: Props) => {
    
    const [openedSidebar, setOpenedSiebar] = useState(false);
    const isMobile = useMediaQuery(`(max-width: ${MOBILE_LIMIT_WIDTH}px)`);

    const contextValue = useCreateReducer<OpenaiInitialState>({
        initialState,
    });
    const {
        state: {
            selectedRole
        },
        dispatch,
    } = contextValue;


    const handleSelectRole = (index: number) => {
        const updatedRole = ROLE_GROUP.filter(
            (r, r_index) => r_index == index
        );
        if(updatedRole.length > 0) {
            dispatch({
                field: "selectedRole",
                value: updatedRole[updatedRole.length - 1]
            });
            dispatch({
                field: 'selectedUtilityGroup',
                value: updatedRole[updatedRole.length - 1].utilities_group
            });
            dispatch({
                field: 'selectedUtility',
                value: updatedRole[updatedRole.length - 1].utilities_group[0].utilities[0]
            })
        }
    };
    const handleSelectUtility = (group_index: number, utility_index: number) => {
        const updatedUtility = selectedRole?.utilities_group[group_index].utilities.filter(
            (u, u_index) => u_index == utility_index
        );
        if(updatedUtility && updatedUtility.length > 0) {
            dispatch({
                field: "selectedUtility",
                value: updatedUtility[updatedUtility?.length - 1] 
            })    
        }
        setOpenedSiebar(false);
    };
    
    const handleShowSidebar = () => {
        setOpenedSiebar(!openedSidebar);
    };

    return (
        <OpenaiContext.Provider
            value={{
                ...contextValue,
                handleSelectRole,
                handleSelectUtility       
            }}
        >
            <AppShell
                navbarOffsetBreakpoint="sm"
                asideOffsetBreakpoint="sm"
                header = {
                    isMobile?
                    <OpenAiHeader 
                        handleShowSidebar={handleShowSidebar}
                        openedSidebar={openedSidebar}
                        isMobile={isMobile}
                    />:<></>
                }
                navbar={
                    <>
                        <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
                            <Sidebar
                                handleShowSidebar={handleShowSidebar}
                                isMobile = {isMobile}
                                openedSidebar={openedSidebar}
                            />
                        </MediaQuery>
                        <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                            <DrawerNav 
                                opened={openedSidebar} 
                                handleShowSidebar={handleShowSidebar} 
                                isMobile={isMobile}
                            />
                        </MediaQuery>
                    </>
                    
                }
            >  
                <Chat 
                    handleShowSidebar={handleShowSidebar}
                    isMobile = {isMobile}
                />    
            </AppShell>
        </OpenaiContext.Provider>
    )
};

const Sidebar = dynamic(async () => {
    const Sidebar = await import("@/components/Sidebar");
    return Sidebar;
});

const DrawerNav: FC<{ opened: boolean; handleShowSidebar: () => void; isMobile: boolean; }> = ({
    opened,
    handleShowSidebar,
  }) => {
    const router = useRouter();
    useEffect(() => {
      router.events.on("routeChangeStart", handleShowSidebar);
      return () => {
        router.events.off("routeChangeStart", handleShowSidebar);
      };
    }, [handleShowSidebar, router.events]);
    
    return (
      <Drawer
        opened={opened}
        onClose={handleShowSidebar}
        size="auto"
        withCloseButton={false}
        sx={{ position: "relative" }}
      >
        <Sidebar 
            handleShowSidebar={handleShowSidebar}
            isMobile={true} 
            openedSidebar={opened}
        />
      </Drawer>
    );
};
export default OpenAi;
export const getSide = () => {
    
}