import { useAtom } from 'jotai';
import { useState } from 'react';
import BufferInput from '@Views/Common/BufferInput';
import { BlueBtn } from '@Views/Common/V2-Button';
import { IPlanPricingData, badgeAtom } from '../badgeAtom';
import { usePricingEditCalls } from '../Hooks/usePlanWriteCalls';
import { useGlobal } from '@Contexts/Global';



export const EditPricingPriceModal = () => {

  const [pageState] = useAtom(badgeAtom);
  const activeModal = pageState.activeModal;
  const pricing: IPlanPricingData = activeModal.pricing;
  const priceType = activeModal.priceType;
  const { updatePriceIni, updatePriceEnd } = usePricingEditCalls(pricing);

  return (
    <Edit head={`Editing pricing price (${priceType})`}
      call={priceType == "Init" ? updatePriceIni : updatePriceEnd}
      priceVal={priceType == "Init" ? pricing.priceRampIni : pricing.priceRampEnd} />
  );

};

const Edit = ({ call, head, priceVal }: { call: any, head: string, priceVal: Number }) => {

  //const toastify = useToast();
  const { state } = useGlobal();

  const [price, setPrice] = useState(priceVal ?? 0);

  const clickHandler = () => {
    //if (validations(val)) return;
    return call(price);
  };


  return (
    <div>
      <div className="text-f15 mb-5">{head}</div>
      <div className='pb-[100px]'>
        <BufferInput
          numericValidations={{
            decimals: { val: 6 },
            min: { val: '0', error: 'Enter a poistive value' },
          }}
          placeholder={1000}
          bgClass="!bg-1 max-w-[250px] mr-[20px]"
          ipClass="mb-5"
          value={price}
          onChange={(val) => {
            //const newPrice = { token: token, amount: Number(val), contract: token.contract, decimals: token.decimals };
            //console.log("Changing price value", val)
            setPrice(val);
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
