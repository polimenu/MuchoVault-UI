import axios from 'axios';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { WagmiConfig } from 'wagmi';
import App from './App';
import '@rainbow-me/rainbowkit/styles.css'
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/theme-dark.css';
import '@szhsin/react-menu/dist/transitions/slide.css';

import wagmiClient, { chains } from './Config/wagmiClient';
import ContextProvider from './contexts';
import { SWRConfig } from 'swr';
import { Provider as JotaiProvider } from 'jotai';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import "./i18n";

const options = {
  fetcher: (url: string) =>
    axios.get('https://mucho.finance/' + url).then((res) => res.data),
  refreshInterval: 1000,
};
import { inject } from '@vercel/analytics';
import { Suspense } from 'react';
inject();
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Suspense fallback="loading">
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} theme={darkTheme()}>
        <HashRouter>
          <SWRConfig value={options}>
            <ContextProvider>
              <JotaiProvider>
                <App />
              </JotaiProvider>
            </ContextProvider>
          </SWRConfig>
        </HashRouter>
      </RainbowKitProvider>
    </WagmiConfig>
  </Suspense>
);
