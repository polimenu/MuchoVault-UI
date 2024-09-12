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
import { FrontPage, FrontPageNew } from '@Views/FrontPage';
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
import { PoolsPage } from '@Views/Pools';
import MyLandbot from '@Views/Common/MyLandBot';
import { PoolDetailPage } from '@Views/Pools/pool';
import { NFTSale } from '@Views/Badge/sale';
import { BadgeAdmin } from '@Views/Badge/admin';
import { IndexAdminPage } from '@Views/Index/admin';

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

  return (
    <>
      <LanguageModal />
      <Routes>
        <Route path="/*" element={<FrontPageNew />} />
        {/*<Route path="/old" element={<FrontPage />} />
        <Route path="/v1" element={<Earn />} />*/}
        <Route path="/badgeAdmin" element={<BadgeAdmin />} />
        <Route path="/badge" element={<Badge />} />
        <Route path="/nft" element={<Badge />} />
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
        {/*<Route path="/index-launch" element={<IndexPage />} />*/}
        <Route path="/index" element={<IndexMarketPage />} />
        <Route path="/index/admin" element={<IndexAdminPage />} />
        {/*<Route path="/poolsf" element={<PoolsFelix />} />*/}
        <Route path="/pools" element={<PoolsPage />} />
        <Route path="/pools/:poolId" element={<PoolDetailPage />} />
        <Route path="/scout" element={<NFTSale nftId={9} title="Baby Scout Otoño 2024" />} />
        <Route path="/membresia" element={<NFTSale nftId={1} title="Membresía Campamento DeFi" />} />
        <Route path="/librodefi" element={<NFTSale nftId={8} title="NFT Libro DeFi" />} />
        {/*<Route path="/metodo" element={<NFTSale nftId={5} title="Método Mucho" />} />*/}


      </Routes>
      <MyLandbot url="https://storage.googleapis.com/landbot.pro/v3/H-2203691-EOCIO7NCFUKIRLTA/index.json" />
    </>
  );
}




export default App;
