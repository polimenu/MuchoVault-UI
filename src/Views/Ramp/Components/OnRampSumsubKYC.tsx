import { useEffect } from 'react';
import { useGlobal } from '@Contexts/Global';
import { useAtom } from 'jotai';
import { ERampStatus, rampAtom } from '../rampAtom';
import snsWebSdk from '@sumsub/websdk';
import i18n from 'src/i18n';



export const OnRampSumsubKYC = () => {
  const [rampState] = useAtom(rampAtom);

  useEffect(() => {
    if (rampState.sumsubToken && rampState.email && rampState.loginStatus == ERampStatus.SUMSUB) {
      document.title = "(mucho) finance | Sumsub KYC";

      const head = document.querySelector("head");
      const script = document.createElement("script");

      script.setAttribute("src", 'https://static.sumsub.com/idensic/static/sns-websdk-builder.js');
      head.appendChild(script);

      //console.log("added sumsub script");

      //console.log("Loading KYC SumSub");
      launchSumSubKYC(rampState.sumsubToken, rampState.email)
    }

  }, [rampState]);


  //sessionStorage.setItem("ramp_session_id", "");
  //console.log("Loading Sumsub KYC");

  return (
    <>
      <div id="sumsub-websdk-container" style={{ backgroundColor: "#F6F6F6" }}></div>
    </>
  );
}



/**
 * @param accessToken - access token that you generated on the backend in Step 2
 */
const launchSumSubKYC = (accessToken: string, email: string) => {
  let snsWebSdkInstance = snsWebSdk.init(
    accessToken,
    // token update callback, must return Promise
    // Access token expired
    // get a new one and pass it to the callback to re-initiate the WebSDK
    () => this.getNewAccessToken()
  )
    .withConf({
      lang: i18n.language, //language of WebSDK texts and comments (ISO 639-1 format)
      email: email,
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