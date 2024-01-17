import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';
import Drawer from '@Views/Common/V2-Drawer';
import { Chain } from 'wagmi';
import { useActiveChain } from '@Hooks/useActiveChain';
import {
  ArbitrumOnly,
} from '@Views/Common/ChainNotSupported';
import Background from 'src/AppStyles';
import { Navbar } from '@Views/Common/Navbar';
import { FarmNetworkList } from './Components/FarmNetworkList';
import { useGetFarmNetwork } from './Hooks/useGetFarmNetworks';
import { MAIRDROP_FARM_NETWORKS } from './Config/mAirdropConfig';
import { NetworksDropDown } from './Components/NetworksDropDown';
import { Section } from '@Views/Common/Card/Section';

const Styles = styled.div`
  width: min(1200px, 100%);
  margin: auto;
  padding-bottom: 24px;
  /* white-space: nowrap; */
`;

const topStyles = 'flex flex-row items-center justify-center mb-2 text-f22';
const descStyles = 'w-[46rem] text-center m-auto tab:w-full';
const noteStyles = 'w-[46rem] text-center m-auto tab:w-full font-weight:bold mt-5 mb-5';

export const ViewContext = React.createContext<{ activeChain: Chain } | null>(
  null
);
const ViewContextProvider = ViewContext.Provider;


export const AdminFarmAirdropPage = () => {
  const { activeChain } = useActiveChain();
  const defNetwork = "Arbitrum";
  const [network, setNetwork] = useState(defNetwork);
  const [netData] = useGetFarmNetwork(network);
  console.log("netData", netData);
  useEffect(() => {
    document.title = "(mucho) finance | airdrop admin";
  }, []);
  return (
    <Background>
      <Navbar />

      <div className="root w-[100vw]">
        <ArbitrumOnly>
          <ViewContextProvider value={{ activeChain }}>
            <main className="content-drawer mt-5">

              <Section
                Heading={<div className={topStyles}>Farm wallets</div>}
                subHeading={
                  <div className={descStyles}></div>
                }
                other={
                  <div>
                    <div className='mb-10'>
                      <NetworksDropDown chain={network} setChain={setNetwork} defaultChain={defNetwork} />
                      {netData && <div>
                        Last Update: {netData.lastUpdate}
                      </div>}
                    </div>
                    <FarmNetworkList farmNetwork={netData} />
                  </div>}
              />



            </main>
            <Drawer open={false}>
              <></>
            </Drawer>
          </ViewContextProvider>
        </ArbitrumOnly>
      </div>

    </Background>
  );
};
