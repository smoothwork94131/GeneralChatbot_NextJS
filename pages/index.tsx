import { MantineProvider, ColorSchemeProvider, MantineThemeOverride } from '@mantine/core';
import { initialState, HomeInitialState } from '@/state/index.state';
import { useCreateReducer } from '@/hooks/useCreateReducer';
import OpenAi from '@/components/openai';
import HomeContext from '@/state/index.context';
import { GetServerSideProps } from 'next';
import { RoleGroup } from '@/types/role';
interface Props {
  serverRoleGroup: RoleGroup[]
}
const Home = ({
  serverRoleGroup
}: Props) => {
  const contextValue = useCreateReducer<HomeInitialState>({
    initialState,
  });
  
  const {
      state: {
        colorScheme,
      },
      dispatch
  } = contextValue;
  
  
  const myTheme: MantineThemeOverride = {
    colorScheme: colorScheme,
    spacing: {
      chatInputPadding: '40px'
    }
  };
  
  return (
    <HomeContext.Provider
      value = {{
        ...contextValue,
      }}
    >
      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={()=>{}}>
          <MantineProvider theme={myTheme} withGlobalStyles withNormalizeCSS>
            <OpenAi 
              
            />
          </MantineProvider>
      </ColorSchemeProvider>  
    </HomeContext.Provider>
 )
}
export default Home;
