import styled from '@emotion/styled';
import { useAtom } from 'jotai';
import React, { useEffect } from 'react';
import Drawer from '@Views/Common/V2-Drawer';
import { Chain } from 'wagmi';
import { getMuchoIndexLaunchCards } from './Components/MuchoIndexLaunchCards';
import { Section } from '../Common/Card/Section';
import { IMuchoIndexAum, IMuchoTokenLauncherData, IMuchoTokenMarketData, writeLauncherData, writeMarketData } from './IndexAtom';
//import { PlanModals } from './Modals';
import { useActiveChain } from '@Hooks/useActiveChain';
import {
  ArbitrumOnly,
} from '@Views/Common/ChainNotSupported';
import MuchoWhite from '@SVG/Elements/MuchoWhite';
import EarnIcon from '@SVG/Elements/EarnIcon';
import Background from 'src/AppStyles';
import { Navbar } from '@Views/Common/Navbar';
import { ViewContext } from '.';
import { OnlyNFT } from '@Views/Common/OnlyNFT';
import { useGetMuchoIndexAum } from './Hooks/useGetMuchoIndexAum';
import { getMuchoIndexAdminCards } from './Components/MuchoIndexAdminCards';

const Styles = styled.div`
  width: min(1200px, 100%);
  margin: auto;
  padding-bottom: 24px;
  /* white-space: nowrap; */
`;

const topStyles = 'flex flex-row items-center justify-center mb-2 text-f22';
const descStyles = 'w-[46rem] text-center m-auto tab:w-full';
const noteStyles = 'w-[46rem] text-center m-auto tab:w-full font-weight:bold mt-5 mb-5';


const ViewContextProvider = ViewContext.Provider;

export const IndexAdminPage = () => {
  const { activeChain } = useActiveChain();
  useEffect(() => {
    document.title = "(mucho) finance | index";
  }, []);

  return (
    <Background>
      <Navbar />

      <div className="root w-[100vw]">
        <ArbitrumOnly>
          <ViewContextProvider value={{ activeChain }}>
            <OnlyNFT heading={<div className={topStyles}>(mucho) Index Admin</div>}
              nftAllowed={[7]}
              activeChain={activeChain}
              child={<>
                <main className="content-drawer">
                  <IndexAdminSection />
                </main>
              </>} />
          </ViewContextProvider>
        </ArbitrumOnly>
      </div>

    </Background>
  );
};

const IndexAdminSection = () => {
  const [data] = useGetMuchoIndexAum();

  return (
    <Styles>
      <Section
        Heading={<div className={topStyles}><EarnIcon className="mr-3" /><MuchoWhite width={120} />
          &nbsp;Index</div>}
        //Cards={getMuchoIndexLaunchCards(data ? data : null)}
        Cards={getMuchoIndexAdminCards(data ? data : null)}
        subHeading={<><div className={descStyles}>Admin</div></>}
      />
    </Styles>
  );
};