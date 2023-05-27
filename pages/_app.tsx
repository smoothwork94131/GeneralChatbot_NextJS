import { Toaster } from 'react-hot-toast';
import { MyUserContextProvider } from '@/utils/app/useUser';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import { useEffect, useState } from 'react';
import type { Database } from '@/types/types_db';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { MantineProvider, ColorSchemeProvider, MantineThemeOverride } from '@mantine/core';
import { initialState, HomeInitialState } from '@/state/index.state';
import { useCreateReducer } from '@/hooks/useCreateReducer';
import HomeContext from '@/state/index.context';
import '@/styles/globals.css';
import Layout from '@/components/Account/Layout';

const inter = Inter({ subsets: ['latin'] });
function App({ Component, pageProps, ...appProps }: AppProps<{}>) {

  const [supabaseClient] = useState(() =>
    createBrowserSupabaseClient<Database>()
  );
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
    <div className={inter.className}>
      <SessionContextProvider supabaseClient={supabaseClient}>
        <MyUserContextProvider>
          <Toaster />
          
          <HomeContext.Provider
            value={{
              ...contextValue,
            }}
          >
            <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={() => { }}>
              <MantineProvider theme={myTheme} withGlobalStyles withNormalizeCSS>
                {
                  [`/`].includes(appProps.router.pathname)?
                  <Component {...pageProps} />:
                  <Layout childrenSize={[`/signin`].includes(appProps.router.pathname)?'400px':'700px'}>
                    <Component {...pageProps} />
                  </Layout>
                }
                <Component {...pageProps} />
              </MantineProvider>
            </ColorSchemeProvider>
          </HomeContext.Provider>
        </MyUserContextProvider>
      </SessionContextProvider>
    </div>
  );
}

export default appWithTranslation(App);
