import { useEffect } from 'react';
import { useGlobal } from '@Contexts/Global';
import { useAtom } from 'jotai';
import { ERampStatus, rampAtom } from '../rampAtom';
import snsWebSdk from '@sumsub/websdk';



export const OnRampSumsubKYC = () => {
  const { state } = useGlobal();
  const [rampState, setRampStateAtom] = useAtom(rampAtom);

  //Script for sumsub KYC
  useEffect(() => {

    if (rampState.loginStatus == ERampStatus.SUMSUB && rampState.sumsubToken) {
      const head = document.querySelector("head");
      const script = document.createElement("script");

      script.setAttribute("src", 'https://static.sumsub.com/idensic/static/sns-websdk-builder.js');
      head.appendChild(script);
      launchSumSubKYC(rampState.sumsubToken);

      return () => {
        head.removeChild(script);
      };

    }
  }, []);

  return <div id="sumsub-websdk-container"></div>;
}



/**
 * @param accessToken - access token that you generated on the backend in Step 2
 */
const launchSumSubKYC = (accessToken: string) => {
  let snsWebSdkInstance = snsWebSdk.init(
    accessToken,
    // token update callback, must return Promise
    // Access token expired
    // get a new one and pass it to the callback to re-initiate the WebSDK
    () => this.getNewAccessToken()
  )
    .withConf({
      lang: 'en', //language of WebSDK texts and comments (ISO 639-1 format)
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