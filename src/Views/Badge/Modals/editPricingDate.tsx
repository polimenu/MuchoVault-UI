import { useAtom } from 'jotai';
import { useState } from 'react';
import BufferInput from '@Views/Common/BufferInput';
import { BlueBtn } from '@Views/Common/V2-Button';
import { IPlanPricingData, badgeAtom } from '../badgeAtom';
import { usePricingEditCalls } from '../Hooks/usePlanWriteCalls';
import { useGlobal } from '@Contexts/Global';
import { dateFormat } from '@Views/Common/Utils';



export const EditPricingDateModal = () => {

  const [pageState] = useAtom(badgeAtom);
  const activeModal = pageState.activeModal;
  const pricing: IPlanPricingData = activeModal.pricing;
  const dateType = activeModal.dateType;
  const { updateIni, updateEnd, updateRampIni, updateRampEnd } = usePricingEditCalls(pricing);
  let call: any, val: string = "";
  switch (dateType) {
    case "Ini":
      call = updateIni;
      val = dateFormat(pricing.dateIni);
      break;
    case "End":
      call = updateEnd;
      val = dateFormat(pricing.dateEnd);
      break;
    case "RampIni":
      call = updateRampIni;
      val = dateFormat(pricing.dateRampIni);
      break;
    case "RampEnd":
      call = updateRampEnd;
      val = dateFormat(pricing.dateRampEnd);
      break;
  }

  return (
    <Edit head={`Editing pricing date (${dateType})`}
      call={call}
      dateVal={val} />
  );

};

const Edit = ({ call, head, dateVal }: { call: any, head: string, dateVal: string }) => {

  //const toastify = useToast();
  const { state } = useGlobal();

  const [dt, setDt] = useState(dateVal ?? "");

  const clickHandler = () => {
    //if (validations(val)) return;
    return call(dt);
  };


  return (
    <div>
      <div className="text-f15 mb-5">{head}</div>
      <div className='pb-[100px]'>
        <BufferInput
          placeholder={"YYYY-MM-DD hh:mm:ss"}
          bgClass="!bg-1 max-w-[250px] mr-[20px]"
          ipClass="mb-5"
          value={dt}
          onChange={(val) => {
            //const newPrice = { token: token, amount: Number(val), contract: token.contract, decimals: token.decimals };
            //console.log("Changing price value", val)
            setDt(val);
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
          Save
        </BlueBtn>
      </div>
    </div>
  );
};
