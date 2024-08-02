import styled from '@emotion/styled';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import Drawer from '@Views/Common/V2-Drawer';
import { AdminPlanCard, getPlanCards } from './Components/AdminPlanCards';
import { Section } from '../Common/Card/Section';
import { DEPRECATED_IBadge, IPlanDetailed, writeBadgeData } from './badgeAtom';
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
import { OnlyNFT } from '@Views/Common/OnlyNFT';
import { BadgeContext } from '.';
import { SalePlanCard } from './Components/SalePlanCards';

const BadgeStyles = styled.div`
  width: min(1200px, 100%);
  margin: auto;
  padding-bottom: 24px;
  /* white-space: nowrap; */
`;

const topStyles = 'flex flex-row items-center justify-center mb-2 text-f22';
const descStyles = 'w-[46rem] text-center m-auto tab:w-full';


const BadgeContextProvider = BadgeContext.Provider;

export const BadgeAdmin = () => {
  const { activeChain } = useActiveChain();
  //console.log("admin", admin);
  useEffect(() => {
    document.title = `(mucho) finance | NFT Plans Admin`;
  }, []);
  return (
    <Background>
      <Navbar hideAccount={false} />
      <div className="root w-[100vw]">
        <ArbitrumOnly>
          <BadgeContextProvider value={{ activeChain }}>
            <OnlyNFT heading={<div className={topStyles}>(mucho) NFT Plans Admin</div>}
              nftAllowed={[7]}
              activeChain={activeChain}
              child={<>
                <main className="content-drawer">
                  <BadgePageAdmin />
                </main>
              </>} />
            <Drawer open={false}>
              <></>
            </Drawer>
          </BadgeContextProvider>
        </ArbitrumOnly>
      </div>
    </Background>

  );
}


const BadgePageAdmin = () => {
  const [, setBadgeData] = useAtom(writeBadgeData);
  const data: IPlanDetailed[] = useGetPlans(true);

  setBadgeData(data);

  return (
    <BadgeStyles>
      <PlanModals />
      <Section
        Heading={
          <>
            <div className={topStyles}>
              <MuchoWhite width={120} /> &nbsp;NFT Plan Admin
            </div>
          </>
        }
        Cards={data.map(p => <div className='max-w-[650px] m-auto mt-[50px]'>
          <AdminPlanCard plan={p} />
        </div>)}
        subHeading={
          <>
            <div className={descStyles}>
              {t("badge.HeroText")}
            </div>
            {/*admin && <div className="mt-5">
              <AddPlanButton />
        </div>*/}
          </>
        }
      />
    </BadgeStyles>
  );
};
