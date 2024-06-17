import styled from '@emotion/styled';
import { useAtom } from 'jotai';
import React, { useContext, useEffect, useState } from 'react';
import Drawer from '@Views/Common/V2-Drawer';
import { Chain } from 'wagmi';
import { getPlanCards } from './Components/PlanCards';
import { Section } from '../Common/Card/Section';
import { IBadge, IPlan, writeBadgeData } from './badgeAtom';
import { useGetPlans } from './Hooks/useAllPlansCall';
import { PlanModals } from './Modals';
import { useActiveChain } from '@Hooks/useActiveChain';
import {
  ArbitrumOnly,
} from '@Views/Common/ChainNotSupported';
import MuchoWhite from '@SVG/Elements/MuchoWhite';
import Background from 'src/AppStyles';
import { Navbar } from '@Views/Common/Navbar';
import { t } from 'i18next';
import { useSetNFTAttributesForUser, useSetNFTBalancesForUser, useSetNFTStatusForUser, useSetNFTTokenIdsForUser } from './Hooks/usePlanStatusForUser';
import { useUserAccount } from '@Hooks/useUserAccount';

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
export const NFT = () => {
  const { activeChain } = useActiveChain();
  //console.log("admin", admin);
  useEffect(() => {
    document.title = `(mucho) finance | NFT Plans V2`;
  }, []);
  return (
    <Background>
      <Navbar />

      <div className="root w-[100vw]">
        <ArbitrumOnly>
          <BadgeContextProvider value={{ activeChain }}>
            <main className="content-drawer">
              <NFTPage />
            </main>
            <Drawer open={false}>
              <></>
            </Drawer>
          </BadgeContextProvider>
        </ArbitrumOnly>
      </div>

    </Background>

  );
};

export const NFTPage = () => {
  const [, setBadgeData] = useAtom(writeBadgeData);

  const data = useGetPlans(false);
  useSetNFTAttributesForUser(data ? data.plans : []);
  setBadgeData(data);

  return (
    <BadgeStyles>
      <PlanModals />
      <Section
        Heading={
          <>
            <div className={topStyles}>
              <MuchoWhite width={120} /> &nbsp;NFT Plan V2
            </div>
          </>
        }
        Cards={getPlanCards(data, false)}
        subHeading={
          <>
            <div className={descStyles}>
              {t("badge.HeroText")}
            </div>
          </>
        }
      />
    </BadgeStyles>
  );
};
