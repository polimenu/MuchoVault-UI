import { Section } from '@Views/Common/Card/Section';
import { Navbar } from '@Views/Common/Navbar';
import styled from '@emotion/styled';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Background from 'src/AppStyles';
import BufferInput from '@Views/Common/BufferInput';
import { BlueBtn } from '@Views/Common/V2-Button';
import { useGlobal } from '@Contexts/Global';
import { OnRampLogin } from './Components/OnRampLogin';
import { OnRampStatus } from './Components/OnRampStatus';
import { useRampSession } from './Hooks/rampHooks';
import { useToast } from '@Contexts/Toast';
import { RampModals } from './Modals';

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


const OnRamp = () => {
  //const [sessionId] = useRampSession();

  //console.log("OnRamp sessionId", sessionId);
  //useTraceUpdate({ setSession });

  //User not logged in
  /*if (!sessionId) {
    console.log("Loading login component");
    return <OnRampLogin />;
  }
  else {
    console.log("Loading status component");
    return <OnRampStatus />;
  }*/


  return <><OnRampLogin /><OnRampStatus /></>;
}

export function useTraceUpdate(props) {
  const prev = useRef(props);
  useEffect(() => {
    const changedProps = Object.entries(props).reduce((ps, [k, v]) => {
      if (prev.current[k] !== v) {
        ps[k] = [prev.current[k], v];
      }
      return ps;
    }, {});
    if (Object.keys(changedProps).length > 0) {
      console.log('Changed props:', changedProps);
    }
    prev.current = props;
  });
}

export const RampPage = () => {
  useEffect(() => {
    document.title = "(mucho) finance | On & Off ramp";
  }, []);


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
                other={<OnRamp />}
              />

            </Styles>
          </main>
        </div>
      </Background>
    </>
  );
};