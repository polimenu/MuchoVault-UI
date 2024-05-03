import { Section } from '@Views/Common/Card/Section';
import { Navbar } from '@Views/Common/Navbar';
import styled from '@emotion/styled';
import React, { useEffect } from 'react';
import Background from 'src/AppStyles';
import { useGetUserHasNFT } from '../Common/Hooks/useNFTCall';
import { ArbitrumOnly } from '@Views/Common/ChainNotSupported';
import { Chain } from 'wagmi';
import { useActiveChain } from '@Hooks/useActiveChain';

const Styles = styled.div`
  width: 100%;
  margin: auto;
  padding-bottom: 24px;
  /* white-space: nowrap; */
`;

const topStyles = 'flex flex-row items-center justify-center mb-2 text-f22';
const descStyles = 'w-[46rem] text-center m-auto tab:w-full';

export const PoolsContext = React.createContext<{ activeChain: Chain } | null>(
  null
);
const PoolContextProvider = PoolsContext.Provider;

export const PoolsPage = () => {
  useEffect(() => {
    document.title = "(mucho) finance | Liquidity pools";
  }, []);

  const { activeChain } = useActiveChain();


  /*
  <script defer type='text/javascript'
    src='https://changenow.io/embeds/exchange-widget/v2/stepper-connector.js'></script>*/
  return (
    <>
      <Background>
        <Navbar />

        <div className="root w-[100vw]">
          <ArbitrumOnly>
            <PoolContextProvider value={{ activeChain }}>
              <main className="content-drawer">
                <Styles>
                  <PoolsComponent />
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
  const hasNFT = useGetUserHasNFT([1, 5]);
  const iframeLink = 'https://mango-moss-045ef401e.4.azurestaticapps.net/#';

  return (<>
    <Section
      Heading={<div className={topStyles}>(mucho) Pools</div>}
      Cards={[]}
      subHeading={<div className={descStyles}>Top Liquidity Pools</div>}
      other={hasNFT ? undefined : <div className={`${descStyles} text-f16 m-auto`}>This content is only available for NFT subscribers</div>}
    />
    {hasNFT && <iframe id='iframe-widget' src={iframeLink} style={{ height: '80656px', width: '100%', border: 'none' }}></iframe>}
  </>
  );
}