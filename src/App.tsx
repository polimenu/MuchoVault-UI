import { Navbar } from './Views/Common/Navbar';
import {
  Routes,
  Route,
} from 'react-router-dom';
import Background from './AppStyles';
import { atom } from 'jotai';
import { Earn } from '@Views/Earn';
import { Badge } from '@Views/Badge';
import ConnectionDrawer from '@Views/Common/V2-Drawer/connectionDrawer';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import { V2AdminPage } from '@Views/V2Admin';
import { V2AdminContract } from '@Views/V2Admin';

if (import.meta.env.VITE_MODE === 'production') {
  // console.log(`import.meta.env.SENTRY_DSN: `, import.meta.env.VITE_SENTRY_DSN);
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 0.5,
  });
}


const AppRoutes = () => {
  return (
    <div className="root w-[100vw]">
      <Routes>
        <Route path="/*" element={<Earn />} />
        <Route path="/badgeadmin" element={<Badge adminObj={true} />} />
        <Route path="/badge" element={<Badge adminObj={false} />} />
        <Route path="/v2/admin/muchovault" element={<V2AdminPage pageType={V2AdminContract.MuchoVault} />} />
        <Route path="/v2/admin/muchohub" element={<V2AdminPage pageType={V2AdminContract.MuchoHub} />} />
      </Routes>
    </div>
  );
};

export const snackAtom = atom<{
  message: null | React.ReactNode;
  severity?: 'success' | 'warning' | 'info' | 'error';
}>({
  message: null,
});

function App() {
  return (
    <>
      <Background>
        <Navbar />
        <AppRoutes />
        <ConnectionDrawer className="open" />
      </Background>
    </>
  );
}

export default App;
