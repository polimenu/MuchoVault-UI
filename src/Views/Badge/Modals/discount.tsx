import { useAtom } from 'jotai';
import { useState } from 'react';
import BufferInput from '@Views/Common/BufferInput';
import { BlueBtn } from '@Views/Common/V2-Button';
import { IPricing, badgeAtom } from '../badgeAtom';
import { usePricingEditCalls } from '../Hooks/usePlanWriteCalls';
import { useGlobal } from '@Contexts/Global';



export const DiscountModal = () => {

  const [pageState] = useAtom(badgeAtom);
  const pricing: IPricing = pageState.activeModal.pricing;
  const { updateDiscountCall } = usePricingEditCalls(pricing);

  return (
    <Edit pricing={pricing} call={updateDiscountCall} buttonTitle={"Set discount"} />
  );

};

const Edit = ({ call, buttonTitle }: { call: any, buttonTitle: string }) => {

  const [address, setAddress] = useState("");
  const [discType, setDiscType] = useState(0);
  const [disc, setDisc] = useState(0);

  const { state } = useGlobal();
  //const toastify = useToast();
  const clickHandler = () => {

    call(address, discType, disc);
  }

  return (
    <>
      <div className={""}>
        <div className="text-f15 mb-5">{buttonTitle}</div>
        <BufferInput
          header={
            <div className="flex flex-row justify-between w-full text-3 text-f14 mt-2">
              <span>Address</span>
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
        <br />
        <BufferInput
          header={
            <div className="flex flex-row justify-between w-full text-3 text-f14 mt-2">
              <span>Type (0 = fixed amount discount, 1 = percentage discount)</span>
            </div>
          }
          placeholder=""
          bgClass={"!bg-1"}
          ipClass={"mt-1"}
          //inputType={isBulk ? "textarea" : null}
          value={discType}
          onChange={(val) => {
            setDiscType(val);
          }}
        />
        <br />
        <BufferInput
          header={
            <div className="flex flex-row justify-between w-full text-3 text-f14 mt-2">
              <span>Discount (e.g. 1000 (fixed) or 15.23 (percentage))</span>
            </div>
          }
          placeholder=""
          bgClass={"!bg-1"}
          ipClass={"mt-1"}
          //inputType={isBulk ? "textarea" : null}
          value={disc}
          onChange={(val) => {
            setDisc(val);
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