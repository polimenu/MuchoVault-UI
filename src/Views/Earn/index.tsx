import styled from '@emotion/styled';
import { useAtom } from 'jotai';
import React, { useEffect } from 'react';
import EarnIcon from 'src/SVG/Elements/EarnIcon';
//import FrontArrow from 'src/SVG/frontArrow';
// import { HeadTitle } from 'Views/Common/TitleHead';
import Drawer from '@Views/Common/V2-Drawer';
import { Chain } from 'wagmi';
import { getEarnCards } from './Components/EarnCards';
import { Section } from '../Common/Card/Section';
import { IEarn, writeEarnData } from './earnAtom';
import { useGetTokenomics } from './Hooks/useTokenomicsMulticall';
import { EarnModals } from './Modals';
import { useActiveChain } from '@Hooks/useActiveChain';
import {
  ArbitrumOnly,
} from '@Views/Common/ChainNotSupported';
import MuchoWhite from '@SVG/Elements/MuchoWhite';
import ErrorIcon from '@SVG/Elements/ErrorIcon';
import { AlignHorizontalCenter } from '@mui/icons-material';
import Background from 'src/AppStyles';
import { Navbar } from '@Views/Common/Navbar';
import ConnectionDrawer from '@Views/Common/V2-Drawer/connectionDrawer';

const EarnStyles = styled.div`
  width: min(1200px, 100%);
  margin: auto;
  padding-bottom: 24px;
  /* white-space: nowrap; */
`;

const LinkStyle = styled.a`
color:#3898FF;
text-decoration:underline`;

const topStyles = 'flex flex-row items-center justify-center mb-2 text-f22';
const descStyles = 'w-[46rem] text-center m-auto tab:w-full mb-5';

export const EarnContext = React.createContext<{ activeChain: Chain } | null>(
  null
);
const EarnContextProvider = EarnContext.Provider;
export const Earn = () => {
  const { activeChain } = useActiveChain();
  useEffect(() => {
    document.title = '(mucho) finance | (mucho) Vaults';
  }, []);
  return (
    <ArbitrumOnly>
      <EarnContextProvider value={{ activeChain }}>
        <main className="content-drawer">
          <EarnPage />
        </main>
        <Drawer open={false}>
          <></>
        </Drawer>
      </EarnContextProvider>
    </ArbitrumOnly>
  );
};

export const EarnPage = () => {
  const [, setEarnData] = useAtom(writeEarnData);
  const data: IEarn = useGetTokenomics();

  //console.log("got tokenomics");
  //console.log(data);
  //console.log("tokenomics end");

  setEarnData(data);

  return (
    <Background>
      <Navbar />

      <div className="root w-[100vw]">
        <EarnStyles>
          <EarnModals />
          <Section
            Heading={
              <div className={topStyles}>
                <EarnIcon className="mr-3" />
                <MuchoWhite width={120} /> &nbsp;Vaults V1 (obsolete)
              </div>
            }
            Cards={getEarnCards(data)}
            subHeading={<>
              <div className={descStyles}>
                <ErrorIcon className="mt-5 m-auto" width="40" />
                <strong className='mb-5'>
                  IMPORTANT NOTICE: V1 is obsolete, <LinkStyle href="/#/v2">use V2 instead</LinkStyle>.
                  No more deposits will be allowed on V1, which will stop rewarding on 1st November 2023
                  (withdrawals will remain available).
                </strong>
              </div>
            </>
            }
          />
        </EarnStyles>
      </div>

      <ConnectionDrawer className="open" />
    </Background>
  );
};
