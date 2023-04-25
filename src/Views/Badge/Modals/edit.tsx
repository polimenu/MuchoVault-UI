import { useAtom } from 'jotai';
import { useContext, useState } from 'react';
import BufferInput from '@Views/Common/BufferInput';
import { Display } from '@Views/Common/Tooltips/Display';
import { BlueBtn } from '@Views/Common/V2-Button';
import { IPlan, badgeAtom } from '../badgeAtom';
import { usePlanEditCalls } from '../Hooks/usePlanEditCalls';
//import { EARN_CONFIG } from '../Config/Pools';
import { toFixed } from '@Utils/NumString';
import { getPosInf, gt, gte } from '@Utils/NumString/stringArithmatics';
import { useGlobal } from '@Contexts/Global';
import { useToast } from '@Contexts/Toast';
import { BadgeContext } from '..';
import { IContract } from 'src/Interfaces/interfaces';
import { TokenDropdown } from '@Views/Common/TokenDropdown';



export const EditModal = ({ }: {}) => {

  const [pageState] = useAtom(badgeAtom);
  const activeModal = pageState.activeModal;
  const plan = activeModal.plan;
  const { updatePlanCall } = usePlanEditCalls(plan.id);

  if (activeModal.action == "edit") {

    return (
      <Edit plan={plan} call={updatePlanCall} />
    );
  }
  else {
    /*const muchoConversion = Number(plan.totalStaked) > 0 ? Number(plan.muchoTotalSupply / plan.totalStaked) : 1
    const staked = Number(plan.muchoTotalSupply) > 0 ? Number(plan.userMuchoInWallet * plan.totalStaked / plan.muchoTotalSupply) : 0;

    return <Withdraw head={head} max={staked} unit={activeModal.primaryToken} validations={validations} call={withdrawCall} precision={activeModal.precision} muchoConversion={muchoConversion} />;
    */
  }
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

  return (
    <div>
      <div className="text-f15 mb-5">{head}</div>
      <BufferInput
        header={
          <div className="flex flex-row justify-between w-full text-3 text-f14 mt-2">
            <span>Name</span>
          </div>
        }
        placeholder={plan.name}
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
        placeholder={plan.time}
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
              <TokenDropdown activeToken={subPrice.token} setVal={setSubToken} />
            </span>
          </div>
        }
        numericValidations={{
          decimals: { val: 6 },
          min: { val: '0', error: 'Enter a poistive value' },
        }}
        placeholder={plan.subscriptionPrice.amount}
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
              <TokenDropdown activeToken={renPrice.token} setVal={setRenToken} />
            </span>
          </div>
        }
        numericValidations={{
          decimals: { val: 6 },
          min: { val: '0', error: 'Enter a poistive value' },
        }}
        placeholder={plan.renewalPrice.amount}
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
  const [name, setName] = useState(plan.name);
  const [duration, setDuration] = useState(plan.time);
  const [subPrice, setSubPrice] = useState(plan.subscriptionPrice);
  const [renPrice, setRenPrice] = useState(plan.renewalPrice);

  //const toastify = useToast();
  const { state } = useGlobal();



  const clickHandler = () => {
    //if (validations(val)) return;

    return call(plan.id, name, duration, subPrice, renPrice);
  };


  return (
    <>
      <Common
        head={"Editing plan [" + plan.id + "] - " + plan.name}
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