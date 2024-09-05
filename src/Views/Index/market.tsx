import styled from '@emotion/styled';
import { useAtom } from 'jotai';
import React, { useEffect } from 'react';
import Drawer from '@Views/Common/V2-Drawer';
import { Chain } from 'wagmi';
import { getMuchoIndexLaunchCards } from './Components/MuchoIndexLaunchCards';
import { Section } from '../Common/Card/Section';
import { IMuchoTokenLauncherData, IMuchoTokenMarketData, writeLauncherData, writeMarketData } from './IndexAtom';
//import { PlanModals } from './Modals';
import { useActiveChain } from '@Hooks/useActiveChain';
import {
  ArbitrumOnly,
} from '@Views/Common/ChainNotSupported';
import MuchoWhite from '@SVG/Elements/MuchoWhite';
import { IndexModals } from './Modals';
import EarnIcon from '@SVG/Elements/EarnIcon';
import Background from 'src/AppStyles';
import { Navbar } from '@Views/Common/Navbar';
import { useGetMuchoIndexLaunch } from './Hooks/useGetMuchoIndexLaunch';
import { t } from 'i18next';
import { useGetMuchoIndexMarket } from './Hooks/useGetMuchoIndexMarket';
import { getMuchoIndexMarketCards } from './Components/MuchoIndexMarketCards';
import { IndexMarketModals } from './Modals/market';
import { useGetMuchoIndexDailyPrices, useGetMuchoIndexLatestPrice } from './Hooks/useGetMuchoIndexPrices';
import { MuchoIndexTransactionList } from './Components/MuchoIndexMarketTransactionList';
import { useGetMuchoIndexMarketOrders } from './Hooks/useGetMuchoIndexMarketOrders';
import { LineChart } from '@mui/x-charts';
import { ThemeProvider, createTheme } from '@mui/material';
import { MuchoIndexDailyPriceChart } from './Components/MuchoIndexDailyPriceChart';

const Styles = styled.div`
  width: min(1200px, 100%);
  margin: auto;
  padding-bottom: 24px;
  /* white-space: nowrap; */
`;

const topStyles = 'flex flex-row items-center justify-center mb-2 text-f22';
const descStyles = 'w-[46rem] text-center m-auto tab:w-full';
const noteStyles = 'w-[46rem] text-center m-auto tab:w-full font-weight:bold mt-5 mb-5';

export const ViewContext = React.createContext<{ activeChain: Chain } | null>(
  null
);
const ViewContextProvider = ViewContext.Provider;


export const IndexMarketPage = () => {
  const { activeChain } = useActiveChain();
  useEffect(() => {
    document.title = "(mucho) finance | Index";
  }, []);
  return (
    <Background>
      <Navbar />

      <div className="root w-[100vw]">
        <ArbitrumOnly>
          <ViewContextProvider value={{ activeChain }}>
            <main className="content-drawer">
              <IndexMarketUserPage />
            </main>
            <Drawer open={false}>
              <></>
            </Drawer>
          </ViewContextProvider>
        </ArbitrumOnly>
      </div>

    </Background>
  );
};

export const IndexMarketUserPage = () => {
  const [, setMarketData] = useAtom(writeMarketData);
  const data: IMuchoTokenMarketData = useGetMuchoIndexMarket();
  const [price] = useGetMuchoIndexLatestPrice();
  const [dailyPrices] = useGetMuchoIndexDailyPrices();

  const transactions = useGetMuchoIndexMarketOrders();
  setMarketData(data);

  /*const transactions = [
    { orderPosition: 1, orderType: "SELL", orderStatus: "PENDING", remitant: "0x00", amount: 100, fee: 2, date: 1707490959, attempts: 0, lastAttempt: 0 },
    { orderPosition: 2, orderType: "SELL", orderStatus: "CANCELLED", remitant: "0x00", amount: 100, fee: 2, date: 1707490959, attempts: 0, lastAttempt: 0 },
    { orderPosition: 4, orderType: "BUY", orderStatus: "PENDING", remitant: "0x00", amount: 100, fee: 2, date: 1707490959, attempts: 0, lastAttempt: 0 },
    { orderPosition: 9, orderType: "BUY", orderStatus: "CANCELLED", remitant: "0x00", amount: 100, fee: 2, date: 1707490959, attempts: 0, lastAttempt: 0 },
  ];*/
  let iAxis = 0;
  const theme = createTheme({ palette: { mode: "dark" } })

  return (
    <Styles>
      <IndexMarketModals data={data} price={price} />
      <Section
        Heading={<div className={topStyles}><EarnIcon className="mr-3" /><MuchoWhite width={120} />
          &nbsp;Index</div>}
        //Cards={getMuchoIndexLaunchCards(data ? data : null)}
        Cards={getMuchoIndexMarketCards(data ? data : null, price ? price : null)}
        subHeading={<><div className={descStyles}>{t("index.hero")}</div></>}
      />
      <div hidden={!transactions || transactions.length == 0} className='mt-[50px]'>
        <Section
          Heading={<div className={topStyles}>{t("index.Pending Orders")}</div>}
          subHeading={
            <div className={descStyles}>
              {t("index.List of your sell/buy orders pending to execute. They can take up to 10 minutes to execute.")}
            </div>
          }
          other={<MuchoIndexTransactionList transactions={transactions} data={data} />}
        />
      </div>
      {dailyPrices && <div className='mt-[50px]'>
        <Section
          Heading={<div className={topStyles}>{t("index.Historical Price")}</div>}
          subHeading={
            <div className={descStyles}>
              {t("index.Historical price since (mucho) index beginnings.")}
            </div>
          }
          other={
            <MuchoIndexDailyPriceChart data={dailyPrices.filter(p => Number(p.date.substring(8)) % 7 == 0)} />
          }
        />
      </div>}

    </Styles>
  );
};