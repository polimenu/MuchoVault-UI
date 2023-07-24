import styled from '@emotion/styled';
import { useAtom } from 'jotai';
import React, { useEffect } from 'react';
import Drawer from '@Views/Common/V2-Drawer';
import { Chain } from 'wagmi';
import { getPlanCards } from './Components/V2ContractCards';
import { Section } from './Components/Section';
import { IAdminData, writeAdminData } from './v2AdminAtom';
import { useGetV2Contracts } from './Hooks/useAllContractsCall';
import { PlanModals } from './Modals';
import { useActiveChain } from '@Hooks/useActiveChain';
import {
  ArbitrumOnly,
} from '@Views/Common/ChainNotSupported';
import MuchoWhite from '@SVG/Elements/MuchoWhite';
import { AddPlanButton } from './Components/PlanButtons';

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
export const Badge = (admin: boolean) => {
  const { activeChain } = useActiveChain();
  useEffect(() => {
    document.title = "Mucho.finance | V2 Admin";
  }, []);
  return (
    <ArbitrumOnly>
      <ViewContextProvider value={{ activeChain }}>
        <main className="content-drawer">
          <V2AdminPage />
        </main>
        <Drawer open={false}>
          <></>
        </Drawer>
      </ViewContextProvider>
    </ArbitrumOnly>
  );
};

export const V2AdminPage = () => {
  const [, setV2AdminData] = useAtom(writeAdminData);
  const data: IBadge = useGetV2Contracts();

  //console.log("Admin:");
  //console.log();
  //console.log("got tokenomics");
  //console.log(data);
  //console.log("tokenomics end");

  setV2AdminData(data);

  return (
    <Styles>
      <PlanModals />
      <Section
        Heading={
          <>
            <div className={topStyles}>
              <MuchoWhite width={120} /> &nbsp;MuchoVaults V2 Admin
            </div>
          </>
        }
        Cards={getPlanCards(data)}
        subHeading={
          <>
          </>
        }
      />
    </Styles>
  );
};
