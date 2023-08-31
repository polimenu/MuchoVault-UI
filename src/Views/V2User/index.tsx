import styled from '@emotion/styled';
import { useAtom } from 'jotai';
import React, { useEffect } from 'react';
import Drawer from '@Views/Common/V2-Drawer';
import { Chain } from 'wagmi';
import { getMuchoVaultV2AdminCards, getMuchoVaultV2UserCards } from './Components/MuchoVaultV2ContractCards';
import { Section } from '../Common/Card/Section';
import { IMuchoVaultData, writeV2AdminData } from './v2AdminAtom';
import { useGetMuchoVaultV2Data } from './Hooks/useMuchoVaultDataCall';
//import { PlanModals } from './Modals';
import { useActiveChain } from '@Hooks/useActiveChain';
import {
  ArbitrumOnly,
} from '@Views/Common/ChainNotSupported';
import MuchoWhite from '@SVG/Elements/MuchoWhite';
import { V2AdminModals } from './Modals';

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
  MuchoHub,
  MuchoProtocolGmx,
}

export const V2UserPage = ({ pageType }: { pageType: V2AdminContract }) => {
  const { activeChain } = useActiveChain();
  useEffect(() => {
    document.title = "Mucho.finance | V2 Vaults";
  }, []);
  return (
    <ArbitrumOnly>
      <ViewContextProvider value={{ activeChain }}>
        <main className="content-drawer">
          <MuchoVaultV2UserPage />
        </main>
        <Drawer open={false}>
          <></>
        </Drawer>
      </ViewContextProvider>
    </ArbitrumOnly>
  );
};

export const MuchoVaultV2UserPage = () => {
  const [, setV2AdminData] = useAtom(writeV2AdminData);
  const data: IMuchoVaultData = useGetMuchoVaultV2Data();
  setV2AdminData(data);

  return (
    <Styles>
      <V2AdminModals data={data} />
      <Section
        Heading={<div className={topStyles}><MuchoWhite width={120} /> &nbsp;MuchoVault V2</div>}
        Cards={getMuchoVaultV2UserCards(data ? data : null)}
        subHeading={<div className={topStyles}>MuchoVault V2 vaults will automatically invest your deposits in different protocols, allowing you to earn interests. Integration with
          other protocols is programmatic and decentralized, so nobody will own your tokens but you.</div>}
      />
    </Styles>
  );
};