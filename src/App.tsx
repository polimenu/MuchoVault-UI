import {
  Routes,
  Route,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import { atom } from 'jotai';
import { Earn } from '@Views/Earn';
import { Badge } from '@Views/Badge';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import { V2AdminPage } from '@Views/V2Admin';
import { V2AdminContract } from '@Views/V2Admin';
import { V2UserPage } from '@Views/V2User';
import { FrontPage, FrontPageNew } from '@Views/FrontPage';
import { SwapPage } from '@Views/Swap';
import { RampPage } from '@Views/Ramp';
import { AirdropPage } from '@Views/Airdrop';
import { LanguageModal } from '@Views/Common/ModalLanguage';
import { useTranslation } from 'react-i18next';
import { RampAdminPage } from '@Views/Ramp/admin';
import { AdminFarmAirdropPage } from '@Views/Airdrop/farmAdmin';
import { IndexPage } from '@Views/Index';
import { IndexMarketPage } from '@Views/Index/market';
import { RampPageB2B } from '@Views/Ramp/b2b';
import { PoolsFelix } from '@Views/Pools/felix';
import { PoolsPage2 } from '@Views/Pools';
import MyLandbot from '@Views/Common/MyLandBot';
import { OnlyNFT } from '@Views/Common/OnlyNFT';

if (import.meta.env.VITE_MODE === 'production') {
  //console.log(`import.meta.env.SENTRY_DSN: `, import.meta.env.VITE_SENTRY_DSN);
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 0.5,
  });
}



export const snackAtom = atom<{
  message: null | React.ReactNode;
  severity?: 'success' | 'warning' | 'info' | 'error';
}>({
  message: null,
});


function App() {
  const { i18n, t } = useTranslation();
  const topStyles = 'flex flex-row items-center justify-center mb-2 text-f22';
  const router = createBrowserRouter([
    { path: "/*", element: <FrontPageNew /> },
    { path: "/v1", element: <Earn /> },

    { path: "/badgeAdmin", element: <Badge admin={true} /> },
    { path: "/badge", element: <Badge admin={false} /> },
    { path: "/nft", element: <Badge admin={false} /> },
    { path: "/v2", element: <V2UserPage /> },

    { path: "/v2/admin/muchovault", element: <V2AdminPage pageType={V2AdminContract.MuchoVault} version={1} /> },
    { path: "/v2/admin/muchohub", element: <V2AdminPage pageType={V2AdminContract.MuchoHub} version={1} /> },
    { path: "/v2/admin/muchoprotocolgmx", element: <V2AdminPage pageType={V2AdminContract.MuchoProtocolGmx} version={1} /> },
    { path: "/v2/admin/muchoprotocolgmx2", element: <V2AdminPage pageType={V2AdminContract.MuchoProtocolGmx} version={2} /> },

    { path: "/airdrop", element: <AirdropPage /> },
    { path: "/airdrop/admin", element: <AdminFarmAirdropPage /> },
    { path: "/ramp", element: <RampPage /> },
    { path: "/rampb2b", element: <RampPageB2B /> },
    { path: "/ramp/admin", element: <RampAdminPage /> },
    { path: "/index-launch", element: <IndexPage /> },
    { path: "/index", element: <IndexMarketPage /> },
    { path: "/poolsf", element: <PoolsFelix /> },
    { path: "/pools", element: <PoolsPage2 /> },
    { path: "/pools/:poolId", element: <PoolsPage2 />, loader: (({ params }) => params.poolId) }
  ]);

  return (
    <>
      <LanguageModal />
      <RouterProvider router={router} />
      <MyLandbot url="https://storage.googleapis.com/landbot.pro/v3/H-2203691-EOCIO7NCFUKIRLTA/index.json" />
    </>
  );
}




export default App;
