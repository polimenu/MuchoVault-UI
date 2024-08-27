import { ReactNode, useEffect } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import { useGlobal } from '@Contexts/Global';
import { useToast } from '@Contexts/Toast';
import { getError } from 'src/Utils/Contract/getError';
import { APIINDEXURL } from '@Views/Index/Config/mIndexConfig';

interface ICustomToast {
  body?: JSX.Element;
  content: ReactNode;
}

export interface IConfirmationModal {
  asset: {
    name: string;
    img: string;
  };
  type: string;
  strike: string;
  expiration: string;
  is_above: boolean;
}


export function useSignMessageCall() {
  const TOAST_ID = "SIGNMESSAGE";
  const { dispatch } = useGlobal();
  const toastify = useToast();
  const { signMessageAsync } = useSignMessage();
  const { address: sender } = useAccount();

  const signCall = async (
    callBack: (msg: string, a?: any) => Promise<any>,
    message: string
  ) => {
    dispatch({ type: 'SET_TXN_LOADING', payload: 1 });

    try {
      if (!sender) {
        toastify({
          id: TOAST_ID,
          msg: "Wallet not connected",
          type: 'error',
          timings: 100,
        });

        return;
      }

      toastify({
        id: TOAST_ID,
        msg: "Waiting for user's confirmation",
        type: 'info',
        inf: 1,
      });

      const res = await signMessageAsync({ message });

      console.log("Message signed", res);
      const cbRes = await callBack(res, { payload: { res } });
      if (cbRes.status == "OK") {
        toastify({ id: TOAST_ID, msg: `Token transferred, new token ID is ${cbRes.newTokenId}`, timings: 100, type: 'success' });
      }
      else {
        toastify({ id: TOAST_ID, msg: cbRes.errorMessage, timings: 100, type: 'error' });
      }
      dispatch({ type: 'SET_TXN_LOADING', payload: 0 });



    } catch (error) {
      //console.log(`[MESSAGE]error: `, error.message);
      //const errReason = error?.reason;
      //console.log(`[blockchain]parsedErr: `, error.reason);
      dispatch({ type: 'SET_TXN_LOADING', payload: 0 });
      //let err = errReason || getError(error, contractArgs);
      //console.log('[blockchain]err : ', err);
      toastify({ id: TOAST_ID, msg: error.message, type: 'error' });
      //callBack({});
    }
  };

  return { signMessage: signCall };
}

