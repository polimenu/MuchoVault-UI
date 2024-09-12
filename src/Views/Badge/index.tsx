import styled from '@emotion/styled';
import { useAtom } from 'jotai';
import React, { useEffect } from 'react';
import Drawer from '@Views/Common/V2-Drawer';
import { Chain } from 'wagmi';
import { Section } from '../Common/Card/Section';
import { writeBadgeData } from './badgeAtom';
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
import { SalePlanCard } from './Components/SalePlanCards';

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
  //console.log("admin", admin);
  useEffect(() => {
    document.title = `(mucho) finance | NFT Plans`;
  }, []);
  return (
    <Background>
      <Navbar hideAccount={false} />

      <div className="root w-[100vw]">
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
      </div>

    </Background>

  );
};

const BadgePage = () => {
  const [, setBadgeData] = useAtom(writeBadgeData);
  const data = useGetPlans(false);

  setBadgeData(data);

  const now = new Date();
  const availablePlans = data.filter(p => p.planAttributes.enabled && p.pricing.dateEnd > now && p.pricing.dateIni <= now).sort((a, b) => a.pricing.userPrice.amount - b.pricing.userPrice.amount);
  const notAvailablePlans = data.filter(p => availablePlans.map(ap => ap.id).indexOf(p.id) < 0);

  return (
    <BadgeStyles>
      <PlanModals />
      {availablePlans.length > 0 && <Section
        Heading={
          <>
            <div className={topStyles}>
              <MuchoWhite width={120} /> &nbsp;NFT Plan
            </div>
          </>
        }
        Cards={availablePlans.map(p => <div className='max-w-[650px] m-auto mt-[50px]'>
          <SalePlanCard data={p} isSalePage={false} />
        </div>)}
        subHeading={
          <>
            <div className={descStyles}>
              {notAvailablePlans.length > 0 ? t("badge.PlansOnSale") : t("badge.HeroText")}
            </div>
          </>
        }
      />}
      {notAvailablePlans.length > 0 && <Section
        className='mt-[80px]'
        Heading={
          <>
            <div className={topStyles}>
              <MuchoWhite width={120} /> &nbsp;NFT Plan
            </div>
          </>
        }
        Cards={notAvailablePlans.map(p => <div className='max-w-[650px] m-auto mt-[50px]'>
          <SalePlanCard data={p} isSalePage={false} />
        </div>)}
        subHeading={
          <>
            <div className={descStyles}>
              {availablePlans.length > 0 ? t("badge.PlansOffSale") : t("badge.HeroText")}
            </div>
          </>
        }
      />}
    </BadgeStyles>
  );
};
