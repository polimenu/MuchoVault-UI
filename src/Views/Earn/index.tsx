import styled from '@emotion/styled';
import { useAtom } from 'jotai';
import React, { useEffect } from 'react';
import EarnIcon from 'src/SVG/Elements/EarnIcon';
import FrontArrow from 'src/SVG/frontArrow';
// import { HeadTitle } from 'Views/Common/TitleHead';
import Drawer from '@Views/Common/V2-Drawer';
import { Chain } from 'wagmi';
import { getEarnCards } from './Components/EarnCards';
import { Section } from './Components/Section';
import { IEarn, writeEarnData } from './earnAtom';
import { useGetTokenomics } from './Hooks/useTokenomicsMulticall';
import { EarnModals } from './Modals';
import { useActiveChain } from '@Hooks/useActiveChain';
import {
  ArbitrumOnly,
} from '@Views/Common/ChainNotSupported';

const EarnStyles = styled.div`
  width: min(1200px, 100%);
  margin: auto;
  padding-bottom: 24px;
  /* white-space: nowrap; */
`;

const topStyles = 'flex flex-row items-center justify-center mb-2 text-f22';
const descStyles = 'w-[46rem] text-center m-auto tab:w-full';

export const EarnContext = React.createContext<{ activeChain: Chain } | null>(
  null
);
const EarnContextProvider = EarnContext.Provider;
export const Earn = () => {
  const { activeChain } = useActiveChain();
  useEffect(() => {
    document.title = 'Mucho.finance | (mucho) Vaults';
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
    <EarnStyles>
      <EarnModals />
      <Section
        Heading={
          <div className={topStyles}>
            <EarnIcon className="mr-3" />
            (mucho) Vaults
          </div>
        }
        Cards={getEarnCards(data)}
        subHeading={
          <div className={descStyles}>
            Haz staking de USDC, WETH y WBTC para ganar el yield de GLP. Recibirás los tokens muchoUSDC, muchoETH y muchoBTC como "recibo" de tu depósito,
            cuyo valor se irá incrementando gracias a los rewards.
          </div>
        }
      />
    </EarnStyles>
  );
};
