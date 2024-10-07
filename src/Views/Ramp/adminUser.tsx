import { Section } from '@Views/Common/Card/Section';
import { Navbar } from '@Views/Common/Navbar';
import styled from '@emotion/styled';
import { useEffect, useRef, useState } from 'react';
import Background from 'src/AppStyles';
import { OnRampLoginEmail } from './Components/OnRampLoginEmail';
import { useAtom } from 'jotai';
import { ERampStatus, rampAdminDataAtom, rampAtom } from './rampAtom';
import { OnRampLoginOtp } from './Components/OnRampLoginOtp';
import { useRampSession } from './Hooks/login';
import { useActiveChain } from '@Hooks/useActiveChain';
import { ArbitrumOnly } from '@Views/Common/ChainNotSupported';
import { Drawer } from '@mui/material';
import { useGetRampAdminData, useGetRampAdminDataByEmail, useGetRampAdminUserApiTransactions, useGetRampAdminUserBankAccounts, useGetRampAdminUserData, useGetRampAdminUserSessions } from './Hooks/admin';
import { ViewContext } from '@Views/V2Admin';
import { OnRampAdminJsonDetails } from './Components/OnRampAdminJsonDetails';
import BufferInput from '@Views/Common/BufferInput';
import { BlueBtn } from '@Views/Common/V2-Button';
import { OnRampAdminStatus } from './Components/OnRampAdminStatus';

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


const ViewContextProvider = ViewContext.Provider;


export const RampAdminUserPage = () => {
  useEffect(() => {
    document.title = "(mucho) finance | On & Off ramp";
  }, []);

  const [sessionForDetails, setSessionForDetails] = useState("");
  const [inputEmail, setInputEmail] = useState("");
  const { activeChain } = useActiveChain();
  const [rampState,] = useAtom(rampAtom);
  const [email, setEmail] = useState("");
  useRampSession();
  const [rampAdminUserData] = useGetRampAdminUserData(rampState.sessionId, email);
  const [rampAdminBankAccounts] = useGetRampAdminUserBankAccounts(rampState.sessionId, email);
  const [rampAdminSessions] = useGetRampAdminUserSessions(rampState.sessionId, email);
  const [rampAdminApiTransactions] = useGetRampAdminUserApiTransactions(rampState.sessionId, sessionForDetails);
  const [, setRampAdminData] = useAtom(rampAdminDataAtom);
  const rampAdminData = useGetRampAdminDataByEmail(rampState.sessionId, email, true);
  //console.log("Rampdata", rampData);

  useEffect(() => {
    setRampAdminData(rampAdminData);
    console.log("Rampdata set", rampAdminData);
  }, [JSON.stringify(rampAdminData)]);

  return (
    <>
      <Background>
        <Navbar />

        <ArbitrumOnly>
          <ViewContextProvider value={{ activeChain }}>
            <div className="root w-[100vw]">
              <main className="content-drawer">
                <Styles>
                  <Section
                    Heading={<div className={topStyles}>On & Off Ramp Admin - User Details</div>}
                    subHeading={<div className={descStyles}></div>}
                    other={<>
                      {rampState.loginStatus == ERampStatus.NOT_LOGGED && <>
                        <OnRampLoginEmail />
                      </>}
                      {rampState.loginStatus == ERampStatus.OTP_SENT && <OnRampLoginOtp />}
                      {rampState.loginStatus == ERampStatus.LOGGED &&
                        <>
                          <div className='flex text-f16'>
                            Email:
                            <BufferInput placeholder={"a@a.com"} bgClass="!bg-1" ipClass="mt-1" className='w-[15vw]' value={inputEmail} onChange={(val) => { setInputEmail(val) }} />
                            <BlueBtn className='!w-fit px-4 rounded-sm !h-7' onClick={() => {
                              console.log("Setting email", inputEmail)
                              setEmail(inputEmail);
                            }}>Search</BlueBtn>
                          </div>
                          {email.length > 0 && <>
                            <OnRampAdminStatus />
                            <div className='text-f16 mt-[25px]'>User details:</div>
                            <OnRampAdminJsonDetails data={rampAdminUserData} />
                            <div className='text-f16 mt-[25px]'>OnRamp Bank account(s):</div>
                            <OnRampAdminJsonDetails data={rampAdminBankAccounts} />
                            <div className='text-f16 mt-[25px]'>Last session(s):</div>
                            <div className='text-f14 pl-5 mt-5'>
                              {rampAdminSessions && rampAdminSessions.apiTransactions && rampAdminSessions.apiTransactions.map(a => <div id={"ses_" + a.session}>
                                <BlueBtn onClick={() => { setSessionForDetails(a.session); }} className='!w-fit px-4 rounded-sm !h-7 mb-5'>{a.session.substring(0, 5)}... ({a.time})</BlueBtn>

                              </div>)}
                            </div>
                            <div className='text-f16 mt-[25px]'>Session API transactions ({sessionForDetails}):</div>
                            <OnRampAdminJsonDetails data={rampAdminApiTransactions} />
                          </>}
                        </>}
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