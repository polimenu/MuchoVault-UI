import { useAtom } from 'jotai';
import { useContext, useState } from 'react';
import BufferInput from '@Views/Common/BufferInput';
import { Display } from '@Views/Common/Tooltips/Display';
import { BlueBtn } from '@Views/Common/V2-Button';
import { badgeAtom } from '../badgeAtom';
//import { EARN_CONFIG } from '../Config/Pools';
import { toFixed } from '@Utils/NumString';
import { getPosInf, gt, gte } from '@Utils/NumString/stringArithmatics';
import { useGlobal } from '@Contexts/Global';
import { useToast } from '@Contexts/Toast';
import { BadgeContext } from '..';
import { erc20ABI } from 'wagmi';
import { IContract } from 'src/Interfaces/interfaces';
import { useGetAllowance, useGetApprovalAmount } from '../../Common/Hooks/useAllowanceCall';
import { usePlanUserCalls } from '../Hooks/usePlanWriteCalls';
import { BADGE_CONFIG } from '../Config/BadgeConfig';

export const SubscribeUserModal = ({
  renew
}: {
  renew: boolean;
}) => {

  const [pageState] = useAtom(badgeAtom);
  const activeModal = pageState.activeModal;
  const plan = activeModal.plan;
  const { subscribeUserCall, renewUserCall } = usePlanUserCalls();
  const call = renew ? renewUserCall : subscribeUserCall;
  const price = renew ? plan.renewalPrice : plan.subscriptionPrice;
  const head = renew ? `Renew your plan ${plan.name}` : `Subscribe to plan ${plan.name}`;
  const button = renew ? "Pay & renew" : "Pay & subscribe";

  const tokenContract: IContract = {
    abi: erc20ABI,
    contract: price.contract
  };
  return (
    <Subscribe
      planId={plan.id}
      head={head}
      unit={price.token}
      tokenContract={tokenContract}
      call={call}
      precision={2}
      decimals={price.decimals}
      amount={price.amount}
      button={button}
    />
  );
};


const Subscribe = ({ planId, head, unit, tokenContract, call, precision, decimals, amount, button }:
  { planId: number; head: string; unit: string; tokenContract: IContract; call: any; precision: number; decimals: number; amount: number; button: string }) => {
  //console.log("DEPOSIT CALL:"); console.log(call);
  const { activeChain } = useContext(BadgeContext);
  const { approve } = useGetApprovalAmount(
    tokenContract?.abi,
    tokenContract?.contract,
    BADGE_CONFIG[activeChain.id].MuchoBadgeManager
  );
  const toastify = useToast();
  const [approveState, setApprovalState] = useState(false);
  const { state } = useGlobal();

  //console.log("Decimals:"); console.log(decimals);
  const allowance = useGetAllowance(tokenContract.contract, decimals, BADGE_CONFIG[activeChain.id]?.MuchoBadgeManager, activeChain.id);
  //console.log("Allowance:"); console.log(allowance);

  const isApproved = gte(Number(allowance), amount || '1');

  const clickHandler = () => {
    return call(planId);
  };


  return (
    <>
      <div>
        <div className="text-f15 mb-5">{head}</div>
        <BufferInput
          header={
            <div className="flex flex-row justify-between w-full text-3 text-f14 mt-2">
              <span>Fee</span>
            </div>
          }
          numericValidations={{
            decimals: { val: 6 },
            min: { val: amount.toString(), error: `Amount to pay is ${amount}` },
          }}
          placeholder="0.0"
          bgClass="!bg-1"
          ipClass="mt-1"
          value={amount}
          unit={
            <span className="text-f16 flex justify-between w-fit">
              {unit}
            </span>
          }
        />
      </div>
      <div className="flex whitespace-nowrap mt-5">
        <BlueBtn
          onClick={() => approve(toFixed(getPosInf(), 0), setApprovalState)}
          className="mr-4 rounded"
          isDisabled={isApproved || state.txnLoading > 1}
          isLoading={state.txnLoading === 1 && approveState}
        >
          Approve
        </BlueBtn>
        <BlueBtn
          onClick={clickHandler}
          className="rounded"
          isDisabled={state.txnLoading > 1 || !isApproved}
          isLoading={state.txnLoading === 1 && !approveState}
        >
          {button}
        </BlueBtn>
      </div>
    </>
  );
};
