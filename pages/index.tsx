import { MantineProvider, ColorSchemeProvider, MantineThemeOverride } from '@mantine/core';
import { initialState, HomeInitialState } from './index.state';
import { useCreateReducer } from '@/hooks/useCreateReducer';
import OpenAi from './api/openai';
import HomeContext from './index.context';
export default function Home() {
  const contextValue = useCreateReducer<HomeInitialState>({
    initialState,
  });
  const {
      state: {
        colorScheme,
      }
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