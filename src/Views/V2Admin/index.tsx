import styled from '@emotion/styled';
import { useAtom } from 'jotai';
import React, { useEffect } from 'react';
import Drawer from '@Views/Common/V2-Drawer';
import { Chain } from 'wagmi';
import { getMuchoVaultV2AdminCards } from './Components/MuchoVaultV2ContractCards';
import { Section } from '../Common/Card/Section';
import { IAdminV2Data, IMuchoHubData, IMuchoVaultData, writeV2AdminData } from './v2AdminAtom';
import { useGetMuchoHubV2Data, useGetMuchoVaultV2Data } from './Hooks/useAllContractsCall';
//import { PlanModals } from './Modals';
import { useActiveChain } from '@Hooks/useActiveChain';
import {
  ArbitrumOnly,
} from '@Views/Common/ChainNotSupported';
import MuchoWhite from '@SVG/Elements/MuchoWhite';
import { AddPlanButton } from './Components/MuchoVaultAdminButtons';
import { V2AdminModals } from './Modals';
import { getMuchoHubV2AdminCards } from './Components/MuchoHubV2ContractCards';

const Styles = styled.div`
  width: min(1200px, 100%);
  margin: auto;
  padding-bottom: 24px;
  /* white-space: nowrap; */
`;

const topStyles = 'flex flex-row items-center justify-center mb-2 text-f22';
const descStyles = 'w-[46rem] text-center m-auto tab:w-full';

export const ViewContext = React.createContext<{ activeChain: Chain } | null>(
  null
);
const ViewContextProvider = ViewContext.Provider;

export enum V2AdminContract {
  MuchoVault,
  MuchoHub
}

export const V2AdminPage = ({ pageType }: { pageType: V2AdminContract }) => {
  const { activeChain } = useActiveChain();
  useEffect(() => {
    document.title = "Mucho.finance | V2 Admin";
  }, []);
  return (
    <ArbitrumOnly>
      <ViewContextProvider value={{ activeChain }}>
        <main className="content-drawer">
          {pageType == V2AdminContract.MuchoVault && <MuchoVaultV2AdminPage />}
          {pageType == V2AdminContract.MuchoHub && <MuchoHubV2AdminPage />}
        </main>
        <Drawer open={false}>
          <></>
        </Drawer>
      </ViewContextProvider>
    </ArbitrumOnly>
  );
};

export const MuchoVaultV2AdminPage = () => {
  const [, setV2AdminData] = useAtom(writeV2AdminData);
  const data: IMuchoVaultData = useGetMuchoVaultV2Data();
  setV2AdminData(data);

  return (
    <Styles>
      <V2AdminModals />
      <Section
        Heading={<div className={topStyles}><MuchoWhite width={120} /> &nbsp;MuchoVault V2 Admin</div>}
        Cards={getMuchoVaultV2AdminCards(data ? data : null)}
        subHeading={<div className={topStyles}>MuchoVault Contract</div>}
      />
    </Styles>
  );
};


export const MuchoHubV2AdminPage = () => {
  const [, setV2AdminData] = useAtom(writeV2AdminData);
  const data: IMuchoHubData = useGetMuchoHubV2Data();
  setV2AdminData(data);

  return (
    <Styles>
      <V2AdminModals />
      <Section
        Heading={<div className={topStyles}><MuchoWhite width={120} /> &nbsp;MuchoVault V2 Admin</div>}
        Cards={getMuchoHubV2AdminCards(data ? data : null)}
        subHeading={<div className={topStyles}>MuchoHub Contract</div>}
      />
    </Styles>
  );
};
