import { Section } from '@Views/Common/Card/Section';
import { Navbar } from '@Views/Common/Navbar';
import styled from '@emotion/styled';
import React, { useEffect } from 'react';
import Background from 'src/AppStyles';
import { OnRampLoginEmail } from './Components/OnRampLoginEmail';
import { useGetRampData } from './Hooks/rampData';
import { RampModals } from './Modals';
import { useAtom } from 'jotai';
import { ERampStatus, rampAtom, rampAdminDataAtom, IRampAdminData } from './rampAtom';
import { OnRampLoginOtp } from './Components/OnRampLoginOtp';
import { useRampSession } from './Hooks/login';
import { Chain } from 'wagmi';
import { useActiveChain } from '@Hooks/useActiveChain';
import { ArbitrumOnly } from '@Views/Common/ChainNotSupported';
import { Drawer } from '@mui/material';
import { OnRampAdminStatus } from './Components/OnRampAdminStatus';
import { useGetRampAdminData } from './Hooks/admin';

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


export const RampAdminPage = () => {
  useEffect(() => {
    document.title = "(mucho) finance | On & Off ramp";
  }, []);

  const { activeChain } = useActiveChain();
  const [rampState,] = useAtom(rampAtom);
  const [, setRampAdminData] = useAtom(rampAdminDataAtom);
  useRampSession();
  const rampAdminData = useGetRampAdminData();
  //console.log("Rampdata", rampData);

  useEffect(() => {
    setRampAdminData(rampAdminData);
    //console.log("Rampdata set", rampData);
  }, [rampAdminData]);

  console.log("RampAdmindata", rampAdminData);
  console.log("rampState", rampState);
  //sessionStorage.setItem("ramp_session_id", "");
  //console.log("Loading RampPage");

  return (
    <>
      <Background>
        <Navbar />

        <ArbitrumOnly>
          <ViewContextProvider value={{ activeChain }}>
            <div className="root w-[100vw]">
              <main className="content-drawer">
                <Styles>
                  <RampModals />
                  <Section
                    Heading={<div className={topStyles}>On & Off Ramp Admin</div>}
                    subHeading={<div className={descStyles}></div>}
                    other={<>
                      {rampState.loginStatus == ERampStatus.NOT_LOGGED && <>
                        <OnRampLoginEmail />
                      </>}
                      {rampState.loginStatus == ERampStatus.OTP_SENT && <OnRampLoginOtp />}
                      {rampState.loginStatus == ERampStatus.LOGGED && <OnRampAdminStatus />}
                    </>}
                  />

                </Styles>
              </main>

              <Drawer open={false}>
                <></>
              </Drawer>
            </div>
          </ViewContextProvider>
        </ArbitrumOnly>
      </Background>
    </>
  );
};