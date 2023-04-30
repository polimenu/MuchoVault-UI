import { useAtom } from 'jotai';
import { useState } from 'react';
import BufferInput from '@Views/Common/BufferInput';
import { BlueBtn } from '@Views/Common/V2-Button';
import { badgeAtom } from '../badgeAtom';
import { usePlanSubUnsubCalls } from '../Hooks/usePlanWriteCalls';
import { useGlobal } from '@Contexts/Global';
import Web3 from 'web3';
import { useToast } from '@Contexts/Toast';



export const SubModal = ({ mode }: { mode: string }) => {

  const [pageState] = useAtom(badgeAtom);
  const planId = pageState.activeModal.plan.id;
  const { subCall, unsubCall, renewCall } = usePlanSubUnsubCalls();

  const modalConfig = {
    "subscribe": {
      call: subCall,
      title: "Subscribe"
    },
    "unsubscribe": {
      call: unsubCall,
      title: "Unsubscribe"
    },
    "renew": {
      call: renewCall,
      title: "Renew"
    }
  }

  return (
    <SubSub planId={planId} call={modalConfig[mode].call} buttonTitle={modalConfig[mode].title} />
  );

};

const SubSub = ({ planId, call, buttonTitle }: { planId: number, call, buttonTitle: string }) => {

  const [subscriber, setSubscriber] = useState("");
  const { state } = useGlobal();
  const toastify = useToast();
  const clickHandler = () => {
    if (!Web3.utils.isAddress(subscriber)) {
      toastify({
        type: 'error',
        msg: 'Please enter a valid address',
        id: 'invalidAddress',
      });
      return false;
    }
    console.log("Calling"); console.log(planId); console.log(subscriber); console.log(call);
    call(planId, subscriber);
  }


  return (
    <>
      <div>
        <div className="text-f15 mb-5">{buttonTitle}</div>
        <BufferInput
          header={
            <div className="flex flex-row justify-between w-full text-3 text-f14 mt-2">
              <span>Address</span>
            </div>
          }
          placeholder="0x..."
          bgClass="!bg-1"
          ipClass="mt-1"
          value={subscriber}
          onChange={(val) => {
            setSubscriber(val);
          }}
        />
      </div>
      <div className="flex whitespace-nowrap mt-5">
        <BlueBtn
          onClick={clickHandler}
          className="rounded"
          isDisabled={state.txnLoading > 1}
          isLoading={state.txnLoading === 1}
        >
          {buttonTitle}
        </BlueBtn>
      </div>
    </>
  );
};