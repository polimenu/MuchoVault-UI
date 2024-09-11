import styled from '@emotion/styled';
import { useAtom } from 'jotai';
import { createContext, useEffect } from 'react';
import Drawer from '@Views/Common/V2-Drawer';
import { Chain } from 'wagmi';
import { Section } from '../Common/Card/Section';
import { writeBadgeData } from './badgeAtom';
import { PlanModals } from './Modals';
import { useActiveChain } from '@Hooks/useActiveChain';
import {
  ArbitrumOnly,
} from '@Views/Common/ChainNotSupported';
import MuchoWhite from '@SVG/Elements/MuchoWhite';
import Background from 'src/AppStyles';
import { Navbar } from '@Views/Common/Navbar';
import { useGetPlansDetailed } from './Hooks/useGetPlanData';
import { SalePlanCard } from './Components/SalePlanCards';
import { BadgeContext } from '.';

const BadgeStyles = styled.div`
  width: min(1200px, 100%);
  margin: auto;
  margin-top:50px;
  padding-bottom: 24px;
  /* white-space: nowrap; */
`;

const topStyles = 'flex flex-row items-center justify-center mb-2 text-f22';
const descStyles = 'w-[46rem] text-center m-auto tab:w-full';


const BadgeContextProvider = BadgeContext.Provider;
export const NFTSale = ({ nftId, title }: { nftId: number, title: string }) => {
  const { activeChain } = useActiveChain();
  //console.log("admin", admin);
  useEffect(() => {
    document.title = `(mucho) finance | ${title}`;
  }, []);
  return (
    <Background>
      <Navbar hideAccount={false} />

      <div className="root w-[100vw]">
        <ArbitrumOnly>
          <BadgeContextProvider value={{ activeChain }}>
            <main className="content-drawer">
              <SalePage nftId={nftId} title={title} />
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

const SalePage = ({ nftId, title }: { nftId: number, title: string }) => {
  const [, setBadgeData] = useAtom(writeBadgeData);

  //console.log("address", address);
  const [data] = useGetPlansDetailed([nftId]);
  //console.log("Data", nftId, data);
  //useSetNFTAttributesForUser(data ? data.plans : []);
  //setBadgeData(data);

  return (
    <BadgeStyles>
      <PlanModals />
      <Section
        Heading={
          <>
            <div className={topStyles}>
              <MuchoWhite width={120} /> &nbsp;{title}
            </div>
          </>
        }
        other={
          <div className='max-w-[650px] m-auto mt-[50px]'>
            <SalePlanCard data={data} isSalePage={true} />
          </div>
        }
        subHeading={
          <>
            {data && data.id == 8 && <div className={descStyles}>
              Tu puerta de entrada al mundo DeFi
            </div>
            }
            {(!data || data.id != 8) && <div className={descStyles}>
              Inscríbete a {title}
            </div>}
          </>
        }
      />
    </BadgeStyles>
  );
};
