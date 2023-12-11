import { useEffect, useState } from 'react';
import BufferInput from '@Views/Common/BufferInput';
import { BlueBtn } from '@Views/Common/V2-Button';
import { useGlobal } from '@Contexts/Global';
import { useAtom } from 'jotai';
import { ERampStatus, rampAtom, rampDataAtom } from '../rampAtom';
import { useOtpSent } from '../Hooks/login';
import { t } from 'i18next';


export const OnRampLoginEmail = () => {
  const [email, setEmail] = useState('');
  const { state } = useGlobal();
  const [rampStateAtom, setRampStateAtom] = useAtom(rampAtom);
  const [val, setVal] = useState('');

  const [otpSent] = useOtpSent(email);
  useEffect(() => {
    if (otpSent) {
      const newRampAtom = { ...rampStateAtom, loginStatus: ERampStatus.OTP_SENT, email: email };
      //console.log("****OTP SENT - Setting ramp atom*****", rampStateAtom, newRampAtom);
      setRampStateAtom(newRampAtom);
    }
  }, [otpSent]);


  if (rampStateAtom.loginStatus == ERampStatus.NOT_LOGGED) {
    const emailLogin = () => {
      setEmail(val);
    };

    return <div className='w-[36rem] m-auto mt-5'>
      <div>
        <div className="text-f15 mb-5">{t("ramp.Login with your e-mail")}</div>
        <BufferInput
          header={
            <div className="flex flex-row justify-between w-full text-3 text-f14 mt-2">
            </div>
          }
          placeholder={t("ramp.Enter your e-mail")}
          bgClass="!bg-1"
          ipClass="mt-1"
          value={val}
          onChange={(val) => {
            setVal(val);
          }}
        />
        <BlueBtn
          onClick={emailLogin}
          className="rounded mt-5"
          isDisabled={state.txnLoading > 1}
          isLoading={state.txnLoading === 1}
        >
          {t("ramp.Login with e-mail")}
        </BlueBtn>
      </div>
    </div>
      ;
  }

  //console.log("EMAIL LOGIN NOT RENDERING");
  return <></>;
}
