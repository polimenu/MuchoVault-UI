import { useAtom } from 'jotai';
import { useState } from 'react';
import BufferInput from '@Views/Common/BufferInput';
import { BlueBtn } from '@Views/Common/V2-Button';
import { IPlan, badgeAtom } from '../badgeAtom';
import { usePlanSubUnsubCalls } from '../Hooks/usePlanWriteCalls';
import { useGlobal } from '@Contexts/Global';



export const TokenIdActionModal = () => {

  const [pageState] = useAtom(badgeAtom);
  const plan: IPlan = pageState.activeModal.plan;
  const mode: string = pageState.activeModal.tokenIdAction;
  const { unsubCall, renewCall } = usePlanSubUnsubCalls(plan.address);

  const modalConfig = {
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
    <TokenIdAction call={modalConfig[mode].call} buttonTitle={modalConfig[mode].title} />
  );

};

const TokenIdAction = ({ call, buttonTitle }: { call: any, buttonTitle: string }) => {

  const [tokenId, setTokenId] = useState("");

  const { state } = useGlobal();
  //const toastify = useToast();
  const clickHandler = () => {
    call(tokenId);
  }


  return (
    <>
      <div>
        <div className="text-f15 mb-5">{buttonTitle}</div>
        <BufferInput
          header={
            <div className="flex flex-row justify-between w-full text-3 text-f14 mt-2">
              <span>Token Id</span>
            </div>
          }
          placeholder="0"
          bgClass={"!bg-1"}
          ipClass={"mt-1"}
          //inputType={isBulk ? "textarea" : null}
          value={tokenId}
          onChange={(val) => {
            setTokenId(val);
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