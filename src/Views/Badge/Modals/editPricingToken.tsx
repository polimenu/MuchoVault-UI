import { useAtom } from 'jotai';
import { useContext, useState } from 'react';
import BufferInput from '@Views/Common/BufferInput';
import { Display } from '@Views/Common/Tooltips/Display';
import { BlueBtn } from '@Views/Common/V2-Button';
import { DEPRECATED_IPlan, IDEPRECATED_Pricing, badgeAtom } from '../badgeAtom';
import { usePlanEditCalls, usePricingEditCalls } from '../Hooks/usePlanWriteCalls';
//import { EARN_CONFIG } from '../Config/Pools';
import { toFixed } from '@Utils/NumString';
import { getPosInf, gt, gte } from '@Utils/NumString/stringArithmatics';
import { useGlobal } from '@Contexts/Global';
import { useToast } from '@Contexts/Toast';
import { BadgeContext } from '..';
import { IContract } from 'src/Interfaces/interfaces';
import { TokenDropdown } from '@Views/Common/TokenDropdown';
import { VALID_TOKENS } from '../Config/BadgeConfig';



export const EditPricingTokenModal = () => {

  const [pageState] = useAtom(badgeAtom);
  const activeModal = pageState.activeModal;
  const pricing = activeModal.pricing;
  const { updatePricingToken } = usePricingEditCalls(pricing);

  return (
    <Edit head={`Editing pricing token`} pricing={pricing} call={updatePricingToken} />
  );

};

const Edit = ({ call, head, pricing }: { call: any, head: string, pricing: IDEPRECATED_Pricing }) => {

  //const toastify = useToast();
  const { state } = useGlobal();

  const [token, setToken] = useState(pricing ? VALID_TOKENS[pricing.token] : { symbol: "", contract: "", decimals: 0 });

  const clickHandler = () => {
    //if (validations(val)) return;
    return call(token.contract);
  };

  const dropdownTokenItems = Object.values(VALID_TOKENS).map((t) => {
    return {
      name: t.symbol,
      displayName: t.symbol,
      contract: t.contract,
      decimals: t.decimals
    };
  });
  //console.log(dropdownTokenItems);

  return (
    <div>
      <div className="text-f15 mb-5">{head}</div>
      <div className='pb-[100px]'>
        <TokenDropdown activeToken={token.symbol} setVal={(val) => {
          const tk = Object.values(VALID_TOKENS).find(t => t.symbol == val);
          //console.log("SETTING TOKEN", val, tk);
          setToken(tk)
        }} items={dropdownTokenItems} className={"mb-[100px]"} />
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