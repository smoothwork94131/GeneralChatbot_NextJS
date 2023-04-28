import { MantineProvider, ColorSchemeProvider, ColorScheme } from '@mantine/core';
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
  
  return (
    <HomeContext.Provider
      value = {{
        ...contextValue,
      }}
    >
      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={()=>{}}>
          <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
            <OpenAi 
            />
          </MantineProvider>
      </ColorSchemeProvider>  
    </HomeContext.Provider>
 )
}