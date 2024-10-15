import { Section } from '@Views/Common/Card/Section';
import { Navbar } from '@Views/Common/Navbar';
import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';
import Background from 'src/AppStyles';
import { useAtom } from 'jotai';
import { usersAtom } from './usersAtom';
import { useActiveChain } from '@Hooks/useActiveChain';
import { ArbitrumOnly } from '@Views/Common/ChainNotSupported';
import { Drawer } from '@mui/material';
import BufferInput from '@Views/Common/BufferInput';
import { OnlyNFT } from '@Views/Common/OnlyNFT';
import { Chain } from 'wagmi';
import { useGetAllLeads } from './Hooks/useGetAllLeads';
import { UserList } from './Components/UserList';

const Styles = styled.div`
  width: min(1300px, 100%);
  margin: auto;
  height: 100%;
  padding-bottom: 24px;

  .stats-label {
    font-size: 1.4rem;
    line-height: 1.6rem;
    border-radius: 0.4rem;
    padding: 1.05rem;
    letter-spacing: 0.4px;
    text-align: left;
    z-index: 1;
    background: linear-gradient(90deg, #0b0b0f 0%, rgba(10, 13, 28, 1) 100%);
    cursor: pointer;
  }

  .stats-label-color {
    width: 0.4rem;
    height: 100%;
    margin-right: 1.5rem;
  }
`;

const topStyles = 'flex flex-row items-center justify-center mb-2 text-f22';
const descStyles = 'w-[46rem] text-center m-auto tab:w-full';

export const ViewContext = React.createContext<{ activeChain: Chain } | null>(
  null
);
const ViewContextProvider = ViewContext.Provider;


export const UserAdminPage = () => {
  useEffect(() => {
    document.title = "(mucho) finance | User Admin";
  }, []);

  const { activeChain } = useActiveChain();
  const [state,] = useAtom(usersAtom);
  const [allLeads] = useGetAllLeads();

  return (
    <>
      <Background>
        <Navbar />

        <ArbitrumOnly>
          <ViewContextProvider value={{ activeChain }}>
            <OnlyNFT heading={<div className={topStyles}>(mucho) User Database</div>}
              nftAllowed={[7]}
              activeChain={activeChain}
              child={<div className="root w-[100vw]">
                <main className="content-drawer">
                  <Styles>
                    <Section
                      Heading={<div className={topStyles}>User Database</div>}
                      subHeading={<div className={descStyles}></div>}
                      other={<UserList allUserList={allLeads} />}
                    />

                  </Styles>
                </main>

                <Drawer open={false}>
                  <></>
                </Drawer>
              </div>} />
          </ViewContextProvider>
        </ArbitrumOnly>
      </Background>
    </>
  );
};