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
import snsWebSdk from '@sumsub/websdk';


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



export const SumsubPage = () => {
  useEffect(() => {
    document.title = "(mucho) finance | Sumsub KYC";

    const head = document.querySelector("head");
    const script = document.createElement("script");

    script.setAttribute("src", 'https://static.sumsub.com/idensic/static/sns-websdk-builder.js');
    head.appendChild(script);

    return () => {
      head.removeChild(script);
    };
  }, []);


  //sessionStorage.setItem("ramp_session_id", "");
  console.log("Loading Sumsub KYC");

  return (
    <>
      <Background>
        <Navbar />
        <div id="sumsub-websdk-container"></div>
      </Background>
    </>
  );
};


function launchWebSdk(accessToken: string, applicantEmail: string, applicantPhone: string, customI18nMessages: string) {
  let snsWebSdkInstance = snsWebSdk.init(
    accessToken,
    // token update callback, must return Promise
    // Access token expired
    // get a new one and pass it to the callback to re-initiate the WebSDK
    () => this.getNewAccessToken()
  )
    .withConf({
      lang: 'es', //language of WebSDK texts and comments (ISO 639-1 format)
      email: applicantEmail,
      phone: applicantPhone,
    })
    .withOptions({ addViewportTag: false, adaptIframeHeight: true })
    // see below what kind of messages WebSDK generates
    .on('idCheck.onStepCompleted', (payload) => {
      console.log('onStepCompleted', payload)
    })
    .on('idCheck.onError', (error) => {
      console.log('onError', error)
    })
    .build();

  // you are ready to go:
  // just launch the WebSDK by providing the container element for it
  snsWebSdkInstance.launch('#sumsub-websdk-container')
}

function getNewAccessToken() {
  return Promise.resolve(newAccessToken)// get a new token from your backend
}