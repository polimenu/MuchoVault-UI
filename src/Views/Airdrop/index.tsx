import styled from '@emotion/styled';
import { useAtom } from 'jotai';
import React, { useEffect } from 'react';
import Drawer from '@Views/Common/V2-Drawer';
import { Chain } from 'wagmi';
import { getMuchoAirdropCards } from './Components/MuchoAirdropCards';
import { Section } from '../Common/Card/Section';
import { IMuchoAirdropManagerData, writeV2AdminData } from './AirdropAtom';
//import { PlanModals } from './Modals';
import { useActiveChain } from '@Hooks/useActiveChain';
import {
  ArbitrumOnly,
} from '@Views/Common/ChainNotSupported';
import MuchoWhite from '@SVG/Elements/MuchoWhite';
import { AirdropModals } from './Modals';
import EarnIcon from '@SVG/Elements/EarnIcon';
import Background from 'src/AppStyles';
import { Navbar } from '@Views/Common/Navbar';
import { useGetMuchoAirdrop } from './Hooks/useGetMuchoAirdrop';
import { t } from 'i18next';

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

export enum V2AdminContract {
  MuchoVault,
  MuchoHub,
  MuchoProtocolGmx,
}

export const AirdropPage = () => {
  const { activeChain } = useActiveChain();
  useEffect(() => {
    document.title = "(mucho) finance | airdrop";
  }, []);
  return (
    <Background>
      <Navbar />

      <div className="root w-[100vw]">
        <ArbitrumOnly>
          <ViewContextProvider value={{ activeChain }}>
            <main className="content-drawer">
              <AirdropUserPage />
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

export const AirdropUserPage = () => {
  const [, setV2AdminData] = useAtom(writeV2AdminData);
  const data: IMuchoAirdropManagerData = useGetMuchoAirdrop();
  setV2AdminData(data);

  return (
    <Styles>
      <AirdropModals data={data} />
      <Section
        Heading={<div className={topStyles}><EarnIcon className="mr-3" /><MuchoWhite width={120} />
          &nbsp;Airdrop</div>}
        Cards={getMuchoAirdropCards(data ? data : null)}
        subHeading={<><div className={descStyles}>{t("airdrop.hero")}</div></>}
      />
    </Styles>
  );
};