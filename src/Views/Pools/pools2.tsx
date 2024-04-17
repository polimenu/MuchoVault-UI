import { Section } from '@Views/Common/Card/Section';
import { Navbar } from '@Views/Common/Navbar';
import styled from '@emotion/styled';
import React, { useEffect } from 'react';
import Background from 'src/AppStyles';
import { useGetUserHasNFT } from './Hooks/useNFTCall';
import { ArbitrumOnly } from '@Views/Common/ChainNotSupported';
import { Chain } from 'wagmi';
import { useActiveChain } from '@Hooks/useActiveChain';
import { useAtom } from 'jotai';
import { poolsAtom, poolsDataAtom } from './poolsAtom';
import { useGetPoolsData } from './Hooks/useGetPoolsData';
import { PoolsTable } from './Components/PoolsTable';
import { PoolsContext } from '.';

const Styles = styled.div`
  width: 100%;
  margin: auto;
  padding-bottom: 24px;
  /* white-space: nowrap; */
`;

const topStyles = 'flex flex-row items-center justify-center mb-2 text-f22';
const descStyles = 'w-[46rem] text-center m-auto tab:w-full';

const PoolContextProvider = PoolsContext.Provider;


export const PoolsPage2 = () => {
  useEffect(() => {
    document.title = "(mucho) finance | Liquidity pools";
  }, []);

  const { activeChain } = useActiveChain();

  return (
    <>
      <Background>
        <Navbar />

        <div className="root w-[100vw]">
          <ArbitrumOnly>
            <PoolContextProvider value={{ activeChain }}>
              <main className="content-drawer">
                <Styles>
                  <PoolsComponent2 />
                </Styles>
              </main>
            </PoolContextProvider>
          </ArbitrumOnly>
        </div>
      </Background>
    </>
  );
};

const PoolsComponent2 = () => {
  const hasNFT = useGetUserHasNFT([1, 5]);
  const [poolsState,] = useAtom(poolsAtom);
  const [, setPoolsData] = useAtom(poolsDataAtom);
  const poolsData = useGetPoolsData();
  //console.log("poolsData", poolsData);
  setPoolsData(poolsData);

  return (<>
    <Section
      Heading={<div className={topStyles}>(mucho) Pools</div>}
      Cards={[]}
      subHeading={<div className={descStyles}>Top Liquidity Pools</div>}
      other={hasNFT ? <PoolsTable data={poolsData} /> : <div className={`${descStyles} text-f16 m-auto`}>This content is only available for NFT subscribers</div>}
    />
  </>
  );
}