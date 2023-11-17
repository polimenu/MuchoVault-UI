import { useEffect, useState } from 'react';
import { setLoginByEmail, useOtpLogin } from '../Hooks/rampHooks';
import BufferInput from '@Views/Common/BufferInput';
import { BlueBtn } from '@Views/Common/V2-Button';
import { useGlobal } from '@Contexts/Global';


export const OnRampLogin = ({ setSession }: { setSession: any }) => {
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const { state } = useGlobal();

  if (!otpSent)
    return <EmailInput email={email} setEmail={setEmail} setOtpSent={setOtpSent} state={state} />;
  else
    return <OtpInput email={email} setSession={setSession} />;
}

const EmailInput = ({ email, setEmail, setOtpSent, state }) => {

  const emailLogin = () => {
    setLoginByEmail(email, setOtpSent);
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
      value={email}
      onChange={(val) => {
        setEmail(val);
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

const OtpInput = ({ email, setSession }: { email: string, setSession: any }) => {
  const [val, setVal] = useState('');
  const { state } = useGlobal();
  const otpLogin = () => { useOtpLogin(email, val, setSession); }

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
      onClick={otpLogin}
      className="rounded"
      isDisabled={state.txnLoading > 1}
      isLoading={state.txnLoading === 1}
    >
      Login
    </BlueBtn>
  </div>;
}