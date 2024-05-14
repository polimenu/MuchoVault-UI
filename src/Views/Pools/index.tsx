import { Section } from '@Views/Common/Card/Section';
import { Navbar } from '@Views/Common/Navbar';
import styled from '@emotion/styled';
import { useEffect } from 'react';
import Background from 'src/AppStyles';
import { ArbitrumOnly } from '@Views/Common/ChainNotSupported';
import { useActiveChain } from '@Hooks/useActiveChain';
import { useAtom } from 'jotai';
import { poolsDataAtom } from './poolsAtom';
import { useGetPoolsData } from './Hooks/useGetPoolsData';
import { PoolsTable } from './Components/PoolsTable';
import { PoolsContext } from './felix';
import { PoolsModals } from './Modals';
import { useGetPoolDetail } from './Hooks/useGetPoolDetail';
import { PoolDetail } from './Components/PoolDetail';
import { OnlyNFT } from '@Views/Common/OnlyNFT';
import { useParams } from 'react-router-dom';

const Styles = styled.div`
  width: 100%;
  margin: auto;
  padding-bottom: 24px;
  /* white-space: nowrap; */
`;

const topStyles = 'flex flex-row items-center justify-center mb-2 text-f22';
const descStyles = 'w-[46rem] text-center m-auto tab:w-full';

const PoolContextProvider = PoolsContext.Provider;


export const PoolsPage = () => {
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
                  <OnlyNFT heading={<div className={topStyles}>(mucho) Pools</div>}
                    nftAllowed={[1, 5]}
                    activeChain={activeChain}
                    child={<>
                      <PoolsModals />
                      <PoolsComponent />
                    </>} />

                </Styles>
              </main>
            </PoolContextProvider>
          </ArbitrumOnly>
        </div>
      </Background>
    </>
  );
};

const PoolsComponent = () => {
  const [, setPoolsData] = useAtom(poolsDataAtom);
  const poolsData = useGetPoolsData();
  //console.log("poolsData", poolsData);
  setPoolsData(poolsData);

  return (<>
    <Section
      Heading={<div className={topStyles}>(mucho) Pools</div>}
      Cards={[]}
      subHeading={<div className={descStyles}>Top Liquidity Pools</div>}
      other={<PoolsTable data={poolsData} />}
    />
  </>
  );
}