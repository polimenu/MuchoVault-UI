import { useAtom } from 'jotai';
import { useContext, useState } from 'react';
import BufferInput from '@Views/Common/BufferInput';
import { BlueBtn } from '@Views/Common/V2-Button';
import { IPlanDetailed, badgeAtom } from '../badgeAtom';
import { toFixed } from '@Utils/NumString';
import { gte } from '@Utils/NumString/stringArithmatics';
import { useGlobal } from '@Contexts/Global';
import { BadgeContext } from '..';
import { erc20ABI } from 'wagmi';
import { IContract } from 'src/Interfaces/interfaces';
import { useGetAllowance, useGetApprovalAmount } from '../../Common/Hooks/useAllowanceCall';
import { useSalePlanUserCalls } from '../Hooks/usePlanWriteCalls';
import { t } from 'i18next';
import { BADGE_CONFIG } from '../Config/BadgeConfig';

export const SaleRenewUserModal = () => {

  const [pageState] = useAtom(badgeAtom);
  const activeModal = pageState.activeModal;
  const data: IPlanDetailed = activeModal.plan;
  const { renewUserCall } = useSalePlanUserCalls();
  const price = data.renewalPricing.userPrice;
  const head = `Renovar mi subscripción a ${data.planAttributes.planName}`;
  const button = `Pagar ${Math.round(100 * price.amount) / 100} ${price.token} y Renovar por ${data.planAttributes.duration} días`;

  //console.log("price.contract", price.contract);
  const tokenContract: IContract = {
    abi: erc20ABI,
    contract: price.contract
  };
  return (
    <Renew
      planId={data.id}
      head={head}
      unit={price.token}
      tokenContract={tokenContract}
      call={renewUserCall}
      precision={2}
      decimals={price.decimals}
      amount={price.amount}
      button={button}
    />
  );
};


const Renew = ({ planId, head, unit, tokenContract, call, precision, decimals, amount, button }:
  { planId: number; head: string; unit: string; tokenContract: IContract; call: any; precision: number; decimals: number; amount: number; button: string }) => {
  const badge_config: (typeof BADGE_CONFIG)[42161] = BADGE_CONFIG[42161]; //Todo multichain

  const { activeChain } = useContext(BadgeContext);
  const { approve } = useGetApprovalAmount(
    tokenContract?.abi,
    tokenContract?.contract,
    badge_config.MuchoNFTFetcher
  );
  //console.log("approve", approve);
  const [approveState, setApprovalState] = useState(false);
  const { state } = useGlobal();

  //console.log("Decimals:"); console.log(decimals);
  const allowance = useGetAllowance(tokenContract.contract, decimals, badge_config.MuchoNFTFetcher, activeChain.id);
  const allowanceAmount = amount;
  //console.log("Allowance:"); console.log(allowance);

  const isApproved = gte(Number(allowance), allowanceAmount || '1');

  const clickHandler = () => {
    return call(planId);
  };

  // console.log("AAA", import.meta.env.ENCRYPTION_ALGO);


  return (
    <>
      <div>
        <div className="text-f16 mb-5">{head}</div>
        <BufferInput isDisabled={true} bgClass="!bg-1" ipClass="mt-1 text-center" value={`${amount.toString()} ${unit}`} onChange={() => { }} />

      </div>
      <div className="flex whitespace-nowrap mt-5">
        {!isApproved && <BlueBtn
          onClick={() => {
            approve(toFixed((allowanceAmount * 10 ** decimals).toString(), 0), setApprovalState);
          }}
          className="mr-4 rounded"
          isDisabled={isApproved || state.txnLoading > 1}
          isLoading={state.txnLoading === 1 && approveState}
        >
          Autorizar Pago
        </BlueBtn>}
        {isApproved && <BlueBtn
          onClick={() => {
            clickHandler();
          }}
          className="rounded"
          isDisabled={state.txnLoading > 1 || !isApproved}
          isLoading={state.txnLoading === 1 && !approveState}
        >
          {button}
        </BlueBtn>}
      </div>
    </>
  );
};
