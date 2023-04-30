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
import { AddPlanButton } from './Components/PlanButtons';

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
export const Badge = (admin: boolean) => {
  const { activeChain } = useActiveChain();
  useEffect(() => {
    document.title = `Mucho.finance | Badge ${admin ? "Admin" : ""}`;
  }, []);
  return (
    <ArbitrumOnly>
      <BadgeContextProvider value={{ activeChain }}>
        <main className="content-drawer">
          <BadgePage admin={admin} />
        </main>
        <Drawer open={false}>
          <></>
        </Drawer>
      </BadgeContextProvider>
    </ArbitrumOnly>
  );
};

export const BadgePage = (adminObj) => {
  const [, setBadgeData] = useAtom(writeBadgeData);
  const data: IBadge = useGetPlans();
  const admin = adminObj.admin.adminObj;  //Algun día Satan nos encontrará

  //console.log("Admin:");
  //console.log();
  //console.log("got tokenomics");
  //console.log(data);
  //console.log("tokenomics end");

  setBadgeData(data);

  return (
    <BadgeStyles>
      <PlanModals />
      <Section
        Heading={
          <>
            <div className={topStyles}>
              <MuchoWhite width={120} /> &nbsp;Badge {admin ? "Admin" : ""}
            </div>
          </>
        }
        Cards={getPlanCards(data, admin)}
        subHeading={
          <>
            <div className={descStyles}>
              Subscribe to your plan, and you will receive a NFT token that will identify you with benefits in our protocols!
            </div>
            {admin && <div className="mt-5">
              <AddPlanButton />
            </div>}
          </>
        }
      />
    </BadgeStyles>
  );
};
