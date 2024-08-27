import { useAtom } from 'jotai';
import { useState } from 'react';
import BufferInput from '@Views/Common/BufferInput';
import { BlueBtn } from '@Views/Common/V2-Button';
import { IPlanDetailed, badgeAtom } from '../badgeAtom';
import { useTokenIdActionCalls } from '../Hooks/usePlanWriteCalls';
import { useGlobal } from '@Contexts/Global';
import { isAddress } from 'ethers/lib/utils.js';
import { useToast } from '@Contexts/Toast';



export const TransferModal = () => {

  const [pageState] = useAtom(badgeAtom);
  const plan: IPlanDetailed = pageState.activeModal.plan;
  const { transferCall } = useTokenIdActionCalls(plan);


  return (
    <Transfer plan={plan} call={transferCall} />
  );

};

const Transfer = ({ call, plan }: { call: any, plan: IPlanDetailed }) => {

  const [address, setAddress] = useState("");
  const toastify = useToast();

  const { state } = useGlobal();
  //const toastify = useToast();
  const clickHandler = () => {
    //console.log("Calling"); console.log(planId); console.log(subscriber); console.log(call);
    if (!isAddress(address)) {
      toastify({ msg: "Introduce una dirección válida", type: "error", timings: 50 })
    }
    else {

      call(plan.tokenIdAttributes.tokenId, address);
    }
  }


  return (
    <>
      <div className={""}>
        <div className="text-f15 mb-5">Transferir NFT</div>
        <BufferInput
          header={
            <div className="flex flex-row justify-between w-full text-3 text-f14 mt-2">
              <span>Dirección de destino</span>
            </div>
          }
          placeholder="0x..."
          bgClass={"!bg-1"}
          ipClass={"mt-1"}
          //inputType={isBulk ? "textarea" : null}
          value={address}
          onChange={(val) => {
            setAddress(val);
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
          Enviar mi NFT a la dirección indicada
        </BlueBtn>
      </div>
    </>
  );
};