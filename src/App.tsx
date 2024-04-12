import {
  Routes,
  Route,
} from 'react-router-dom';
import { atom } from 'jotai';
import { Earn } from '@Views/Earn';
import { Badge } from '@Views/Badge';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import { V2AdminPage } from '@Views/V2Admin';
import { V2AdminContract } from '@Views/V2Admin';
import { V2UserPage } from '@Views/V2User';
import { FrontPage } from '@Views/FrontPage';
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
import { PoolsPage } from '@Views/Pools';

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
  return (
    <>
      <LanguageModal />
      <Routes>
        <Route path="/*" element={<FrontPage />} />
        <Route path="/v1" element={<Earn />} />
        <Route path="/badgeAdmin" element={<Badge admin={true} />} />
        <Route path="/badge" element={<Badge admin={false} />} />
        <Route path="/nft" element={<Badge admin={false} />} />
        <Route path="/v2" element={<V2UserPage />} />
        <Route path="/v2/admin/muchovault" element={<V2AdminPage pageType={V2AdminContract.MuchoVault} />} />
        <Route path="/v2/admin/muchohub" element={<V2AdminPage pageType={V2AdminContract.MuchoHub} />} />
        <Route path="/v2/admin/muchoprotocolgmx" element={<V2AdminPage pageType={V2AdminContract.MuchoProtocolGmx} />} />
        <Route path="/v2/admin/muchoprotocolgmx2" element={<V2AdminPage pageType={V2AdminContract.MuchoProtocolGmx} version={2} />} />
        {/*<Route path="/swap" element={<SwapPage />} />*/}
        <Route path="/airdrop" element={<AirdropPage />} />
        <Route path="/airdrop/admin" element={<AdminFarmAirdropPage />} />
        <Route path="/ramp" element={<RampPage />} />
        <Route path="/rampb2b" element={<RampPageB2B />} />
        <Route path="/ramp/admin" element={<RampAdminPage />} />
        <Route path="/index-launch" element={<IndexPage />} />
        <Route path="/index" element={<IndexMarketPage />} />
        <Route path="/pools" element={<PoolsPage />} />


      </Routes>
    </>
  );
}




export default App;
