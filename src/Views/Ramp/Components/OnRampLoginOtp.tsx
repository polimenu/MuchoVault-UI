import { useEffect, useState } from 'react';
import BufferInput from '@Views/Common/BufferInput';
import { BlueBtn } from '@Views/Common/V2-Button';
import { useGlobal } from '@Contexts/Global';
import { useAtom } from 'jotai';
import { ERampStatus, rampAtom, rampDataAtom } from '../rampAtom';
import { useOtpLogin } from '../Hooks/login';
import { t } from 'i18next';


export const OnRampLoginOtp = () => {
  const { state } = useGlobal();
  const [session, setSession] = useState('');
  const [rampState, setRampState] = useAtom(rampAtom);
  const [otp, setOtp] = useState('');
  const [val, setVal] = useState('');
  useOtpLogin(rampState.email, otp, setSession);
  useEffect(() => {
    if (session) {
      setRampState({ ...rampState, sessionId: session, loginStatus: ERampStatus.LOGGED });
      sessionStorage.setItem("ramp_session_id", session);
    }
  }
    , [session]);


  if (rampState.loginStatus == ERampStatus.OTP_SENT) {
    return <div className='w-[46rem] m-auto mt-5'><div>
      <div className="text-f15 mb-5">{t("ramp.Enter the one-time code sent to your e-mail")}:</div>
      <BufferInput
        placeholder={t("ramp.One-time code")}
        bgClass="!bg-1"
        ipClass="mt-1"
        value={val}
        onChange={(val) => {
          setVal(val);
        }}
      />
      <BlueBtn
        onClick={() => { setOtp(val); }}
        className="rounded mt-5"
        isDisabled={state.txnLoading > 1}
        isLoading={state.txnLoading === 1}
      >
        {t("ramp.Login")}
      </BlueBtn>
    </div></div>;
  }

  //console.log("SESSION OK, OTP NOT RENDERING", rampState);
  return <></>;
}
