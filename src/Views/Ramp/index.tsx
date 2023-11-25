import { Section } from '@Views/Common/Card/Section';
import { Navbar } from '@Views/Common/Navbar';
import styled from '@emotion/styled';
import { useEffect, useRef } from 'react';
import Background from 'src/AppStyles';
import { OnRampLoginEmail } from './Components/OnRampLoginEmail';
import { OnRampStatus } from './Components/OnRampStatus';
import { useGetRampData } from './Hooks/rampData';
import { RampModals } from './Modals';
import { useAtom } from 'jotai';
import { ERampStatus, rampAtom, rampDataAtom } from './rampAtom';
import { OnRampLoginOtp } from './Components/OnRampLoginOtp';
import { useRampSession } from './Hooks/login';
import { OnRampSumsubKYC } from './Components/OnRampSumsubKYC';

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



export const RampPage = () => {
  useEffect(() => {
    document.title = "(mucho) finance | On & Off ramp";
  }, []);


  const [rampState,] = useAtom(rampAtom);
  const [, setRampData] = useAtom(rampDataAtom);
  useRampSession();
  const rampData = useGetRampData();
  useEffect(() => {
    setRampData(rampData);
    console.log("Rampdata set", rampData);
  }, [rampData]);


  //sessionStorage.setItem("ramp_session_id", "");
  console.log("Loading RampPage");

  return (
    <>
      <Background>
        <Navbar />

        <div className="root w-[100vw]">
          <main className="content-drawer">
            <Styles>
              <RampModals />
              <Section
                Heading={<div className={topStyles}>On & Off Ramp</div>}
                subHeading={<div className={descStyles}>Move from FIAT to Crypto, or counterwise</div>}
                other={<>
                  {rampState.loginStatus == ERampStatus.NOT_LOGGED && <OnRampLoginEmail />}
                  {rampState.loginStatus == ERampStatus.OTP_SENT && <OnRampLoginOtp />}
                  {rampState.loginStatus == ERampStatus.LOGGED && <OnRampStatus />}
                  <OnRampSumsubKYC />
                </>}
              />

            </Styles>
          </main>
        </div>
      </Background>
    </>
  );
};