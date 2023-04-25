import styled from '@emotion/styled';
import { useAtom } from 'jotai';
import React, { useEffect } from 'react';
import Drawer from '@Views/Common/V2-Drawer';
import { Chain } from 'wagmi';
import { getPlanCards } from './Components/PlanCards';
import { Section } from './Components/Section';
import { IBadge, writeBadgeData } from './badgeAtom';
import { useGetPlans } from './Hooks/useAllPlansCall';
import { PlanModals } from './Modals';
import { useActiveChain } from '@Hooks/useActiveChain';
import {
  ArbitrumOnly,
} from '@Views/Common/ChainNotSupported';
import MuchoWhite from '@SVG/Elements/MuchoWhite';

const BadgeStyles = styled.div`
  width: min(1200px, 100%);
  margin: auto;
  padding-bottom: 24px;
  /* white-space: nowrap; */
`;

const topStyles = 'flex flex-row items-center justify-center mb-2 text-f22';
const descStyles = 'w-[46rem] text-center m-auto tab:w-full';

export const BadgeContext = React.createContext<{ activeChain: Chain } | null>(
  null
);
const BadgeContextProvider = BadgeContext.Provider;
export const Badge = () => {
  const { activeChain } = useActiveChain();
  useEffect(() => {
    document.title = 'Mucho.finance | Badge Admin';
  }, []);
  return (
    <ArbitrumOnly>
      <BadgeContextProvider value={{ activeChain }}>
        <main className="content-drawer">
          <BadgePage />
        </main>
        <Drawer open={false}>
          <></>
        </Drawer>
      </BadgeContextProvider>
    </ArbitrumOnly>
  );
};

export const BadgePage = () => {
  const [, setBadgeData] = useAtom(writeBadgeData);
  const data: IBadge = useGetPlans();

  //console.log("got tokenomics");
  //console.log(data);
  //console.log("tokenomics end");

  setBadgeData(data);

  return (
    <BadgeStyles>
      <PlanModals />
      <Section
        Heading={
          <div className={topStyles}>
            <MuchoWhite width={120} /> &nbsp;Badge Admin
          </div>
        }
        Cards={getPlanCards(data)}
        subHeading={
          <div className={descStyles}>
          </div>
        }
      />
    </BadgeStyles>
  );
};
