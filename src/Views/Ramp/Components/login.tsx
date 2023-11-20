import { useEffect, useState } from 'react';
import { useOtpSent, useOtpLogin, useRampSession } from '../Hooks/rampHooks';
import BufferInput from '@Views/Common/BufferInput';
import { BlueBtn } from '@Views/Common/V2-Button';
import { useGlobal } from '@Contexts/Global';


export const OnRampLogin = () => {
  const [email, setEmail] = useState('');
  const { state } = useGlobal();
  const [loginOtpSent] = useOtpSent(email);
  const [session, setSession] = useRampSession();
  const [otp, setOtp] = useState('');
  useOtpLogin(email, otp, setSession);

  if (!session) {
    if (!loginOtpSent)
      return <EmailInput email={email} setEmail={setEmail} state={state} />;
    else
      return <OtpInput email={email} setOtp={setOtp} />;
  }
}

const EmailInput = ({ email, setEmail, state }) => {
  const [val, setVal] = useState('');

  const emailLogin = () => {
    setEmail(val);
  };

  return <><div>
    <div className="text-f15 mb-5">Login with your e-mail</div>
    <BufferInput
      header={
        <div className="flex flex-row justify-between w-full text-3 text-f14 mt-2">
        </div>
      }
      placeholder="Enter your e-mail"
      bgClass="!bg-1"
      ipClass="mt-1"
      value={val}
      onChange={(val) => {
        setVal(val);
      }}
    />
    <BlueBtn
      onClick={emailLogin}
      className="rounded"
      isDisabled={state.txnLoading > 1}
      isLoading={state.txnLoading === 1}
    >
      Login with e-mail
    </BlueBtn>
  </div>
  </>;
}

const OtpInput = ({ email, setOtp }: { email: string, setOtp: any }) => {
  const [val, setVal] = useState('');
  const { state } = useGlobal();

  return <div>
    <BufferInput
      header={
        <div className="flex flex-row justify-between w-full text-3 text-f14 mt-2">
          <span>A one-time password has been sent to your e-mail, please enter it:</span>
        </div>
      }
      placeholder="One-time code"
      bgClass="!bg-1"
      ipClass="mt-1"
      value={val}
      onChange={(val) => {
        setVal(val);
      }}
    />
    <BlueBtn
      onClick={() => { setOtp(val); }}
      className="rounded"
      isDisabled={state.txnLoading > 1}
      isLoading={state.txnLoading === 1}
    >
      Login
    </BlueBtn>
  </div>;
}