import { useAtom } from 'jotai';
import { useContext, useState } from 'react';
import BufferInput from '@Views/Common/BufferInput';
import { Display } from '@Views/Common/Tooltips/Display';
import { BlueBtn } from '@Views/Common/V2-Button';
import { IPlan, badgeAtom } from '../badgeAtom';
import { usePlanEditCalls } from '../Hooks/usePlanWriteCalls';
//import { EARN_CONFIG } from '../Config/Pools';
import { toFixed } from '@Utils/NumString';
import { getPosInf, gt, gte } from '@Utils/NumString/stringArithmatics';
import { useGlobal } from '@Contexts/Global';
import { useToast } from '@Contexts/Toast';
import { BadgeContext } from '..';
import { IContract } from 'src/Interfaces/interfaces';
import { TokenDropdown } from '@Views/Common/TokenDropdown';
import { VALID_TOKENS } from '../Config/BadgeConfig';



export const EditModal = ({ create }: { create: boolean }) => {

  const [pageState] = useAtom(badgeAtom);
  const activeModal = pageState.activeModal;
  const plan = activeModal.plan;
  const { updatePlanCall, addPlanCall } = usePlanEditCalls(plan ? plan.id : 0);

  return (
    <Edit plan={create ? null : plan} call={create ? addPlanCall : updatePlanCall} />
  );

};

const Common = ({ head, plan, name, setName,
  duration, setDuration,
  subPrice, setSubPrice,
  renPrice, setRenPrice }) => {

  const setSubToken = (tk, ct, d) => {
    setSubPrice({ token: tk, amount: subPrice.amount, contract: ct, decimals: d });
  }
  const setRenToken = (tk, ct, d) => {
    setRenPrice({ token: tk, amount: renPrice.amount, contract: ct, decimals: d });
  }
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
      <BufferInput
        header={
          <div className="flex flex-row justify-between w-full text-3 text-f14 mt-2">
            <span>Name</span>
          </div>
        }
        placeholder={plan ? plan.name : "Name"}
        bgClass="!bg-1"
        ipClass="mt-1"
        value={name}
        onChange={(val) => {
          setName(val);
        }}
      />
      <br />
      <BufferInput
        header={
          <div className="flex flex-row justify-between w-full text-3 text-f14 mt-2">
            <span>Duration (days)</span>
          </div>
        }
        placeholder={plan ? plan.time : "365"}
        bgClass="!bg-1"
        ipClass="mt-1"
        value={duration}
        onChange={(val) => {
          setDuration(val);
        }}
      />
      <br />
      <BufferInput
        header={
          <div className="flex flex-row justify-between w-full text-3 text-f14 mt-2">
            <span>Subscription price</span>
            <br />
            <span className="flex flex-row items-center">
              <TokenDropdown activeToken={subPrice.token} setVal={setSubToken} items={dropdownTokenItems} />
            </span>
          </div>
        }
        numericValidations={{
          decimals: { val: 6 },
          min: { val: '0', error: 'Enter a poistive value' },
        }}
        placeholder={plan ? plan.subscriptionPrice.amount : 1000}
        bgClass="!bg-1"
        ipClass="mt-1"
        value={subPrice.amount}
        onChange={(val) => {
          setSubPrice({ token: subPrice.token, amount: val, contract: subPrice.contract, decimals: subPrice.decimals });
        }}
      />
      <br />
      <BufferInput
        header={
          <div className="flex flex-row justify-between w-full text-3 text-f14 mt-2">
            <span>Renewal price</span>
            <span className="flex flex-row items-center">
              <TokenDropdown activeToken={renPrice.token} setVal={setRenToken} items={dropdownTokenItems} />
            </span>
          </div>
        }
        numericValidations={{
          decimals: { val: 6 },
          min: { val: '0', error: 'Enter a poistive value' },
        }}
        placeholder={plan ? plan.renewalPrice.amount : 1000}
        bgClass="!bg-1"
        ipClass="mt-1"
        value={renPrice.amount}
        onChange={(val) => {
          setRenPrice({ token: renPrice.token, amount: val, contract: renPrice.contract, decimals: renPrice.decimals });
        }}
      />
    </div>
  );
};

const Edit = ({ plan, call }: { plan: IPlan, call }) => {

  const defaultPrice = Object.values(VALID_TOKENS).map(t => {
    return {
      token: t.symbol,
      contract: t.contract,
      decimals: t.decimals,
      amount: 1000, //Default value
    }
  })[0];

  const [name, setName] = useState(plan ? plan.name : "");
  const [duration, setDuration] = useState(plan ? plan.time : "");
  const [subPrice, setSubPrice] = useState(plan ? plan.subscriptionPrice : defaultPrice);
  const [renPrice, setRenPrice] = useState(plan ? plan.renewalPrice : defaultPrice);

  //const toastify = useToast();
  const { state } = useGlobal();



  const clickHandler = () => {
    //if (validations(val)) return;
    if (plan)
      return call(plan.id, name, duration, subPrice, renPrice);
    else
      return call(name, duration, subPrice, renPrice);
  };


  return (
    <>
      <Common
        head={plan ? "Editing plan [" + plan.id + "] - " + plan.name : "Add new plan"}
        plan={plan}
        name={name}
        setName={setName}
        duration={duration}
        setDuration={setDuration}
        subPrice={subPrice}
        setSubPrice={setSubPrice}
        renPrice={renPrice}
        setRenPrice={setRenPrice}
      />
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
    </>
  );
};
/*
const Withdraw = ({ max, head, unit, validations, call, precision, muchoConversion }) => {
  const [val, setVal] = useState('');
  const [pageState] = useAtom(earnAtom);
  const toastify = useToast();
  const { state } = useGlobal();

  const clickHandler = () => {
    if (validations(val)) return;
    if (gt(val, max))
      return toastify({
        type: 'error',
        msg: 'Amount exceeds max withdrawable value.',
        id: '007',
      });

    return call(val * muchoConversion);
  };
  return (
    <>
      <Common
        head={head}
        deposit={false}
        max={max}
        unit={unit}
        val={val}
        setVal={setVal}
        precision={precision}
      />
      <BlueBtn
        className={'px-4 rounded-sm !h-7 w-full mt-5'}
        onClick={clickHandler}
        isDisabled={state.txnLoading > 1}
        isLoading={state.txnLoading === 1}
      >
        Withdraw
      </BlueBtn>
    </>
  );
};
*/