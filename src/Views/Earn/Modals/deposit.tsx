import { useAtom } from 'jotai';
import { useContext, useState } from 'react';
import BufferInput from '@Views/Common/BufferInput';
import { Display } from '@Views/Common/Tooltips/Display';
import { BlueBtn } from '@Views/Common/V2-Button';
import { IPoolInfo, earnAtom, readEarnData } from '../earnAtom';
import {
  useEarnWriteCalls,
} from '../Hooks/useEarnWriteCalls';
import { EARN_CONFIG } from '../Config/Pools';
import { toFixed } from '@Utils/NumString';
import { getPosInf, gt, gte } from '@Utils/NumString/stringArithmatics';
import { useGlobal } from '@Contexts/Global';
import { useToast } from '@Contexts/Toast';
import { EarnContext } from '..';
import { erc20ABI } from 'wagmi';
import { IContract } from 'src/Interfaces/interfaces';
import { useGetAllowance, useGetApprovalAmount } from '../../Common/Hooks/useAllowanceCall';

export const DepositModal = ({
  head
}: {
  head: string;
}) => {

  const [pageState] = useAtom(earnAtom);
  const activeModal = pageState.activeModal;
  const poolInfo = activeModal.poolInfo;
  const { validations, depositCall, withdrawCall } = useEarnWriteCalls(activeModal.vaultId, activeModal.decimals);

  if (activeModal.deposit) {

    const maxToDeposit = Number(Math.min(Number(poolInfo.userAvailableInWallet), Number(poolInfo.vaultcap - poolInfo.totalStaked)));
    const tokenContract: IContract = {
      abi: erc20ABI,
      contract: poolInfo.lpToken
    };
    return (
      <Deposit
        head={head}
        max={maxToDeposit}
        unit={activeModal.primaryToken}
        tokenContract={tokenContract}
        validations={validations}
        call={depositCall}
        precision={activeModal.precision}
        decimals={activeModal.decimals}
      />
    );
  }
  else {
    const muchoConversion = Number(poolInfo.totalStaked) > 0 ? Number(poolInfo.muchoTotalSupply / poolInfo.totalStaked) : 1
    const staked = Number(poolInfo.muchoTotalSupply) > 0 ? Number(poolInfo.userMuchoInWallet * poolInfo.totalStaked / poolInfo.muchoTotalSupply) : 0;

    return <Withdraw head={head} max={staked} unit={activeModal.primaryToken} validations={validations} call={withdrawCall} precision={activeModal.precision} muchoConversion={muchoConversion} />;
  }
};

const Common = ({ val, setVal, head, max, unit, deposit, precision }) => {
  return (
    <div>
      <div className="text-f15 mb-5">{head}</div>
      <BufferInput
        header={
          <div className="flex flex-row justify-between w-full text-3 text-f14 mt-2">
            <span>{deposit ? 'Deposit' : 'Withdraw'}</span>
            <span className="flex flex-row items-center">
              Max:
              <Display data={max} unit={unit} precision={precision} />
            </span>
          </div>
        }
        numericValidations={{
          decimals: { val: 6 },
          max: {
            val: max.toString(),
            error: (deposit ? 'Not enough funds!' : 'Not enough deposited'),
          },
          min: { val: '0', error: 'Enter a poistive value' },
        }}
        placeholder="0.0"
        bgClass="!bg-1"
        ipClass="mt-1"
        value={val}
        onChange={(val) => {
          setVal(val);
        }}
        unit={
          <span className="text-f16 flex justify-between w-fit">
            <BlueBtn
              isDisabled={!gt(max, '0')}
              onClick={() => {
                setVal(toFixed(max, 6));
              }}
              className="!py-1 !px-3 !h-fit text-f13 rounded-sm mr-3"
            >
              Max
            </BlueBtn>
            {unit}
          </span>
        }
      />
    </div>
  );
};

const Deposit = ({ tokenContract, max, head, unit, validations, call, precision, decimals }) => {
  //console.log("DEPOSIT CALL:"); console.log(call);
  const [val, setVal] = useState('');
  const { activeChain } = useContext(EarnContext);
  const { approve } = useGetApprovalAmount(
    tokenContract?.abi,
    tokenContract?.contract,
    EARN_CONFIG[activeChain.id]?.MuchoVault
  );
  const toastify = useToast();
  const [approveState, setApprovalState] = useState(false);
  const { state } = useGlobal();

  //console.log("Decimals:"); console.log(decimals);
  const allowance = useGetAllowance(tokenContract.contract, decimals, EARN_CONFIG[activeChain.id]?.MuchoVault, activeChain.id);
  //console.log("Allowance:"); console.log(allowance);

  const isApproved = gte(Number(allowance), val || '1');

  const clickHandler = () => {
    if (validations(val)) return;
    if (gt(val, max))
      return toastify({
        type: 'error',
        msg: 'Amount exceeds balance.',
        id: '007',
      });

    return call(val);
  };


  return (
    <>
      <Common
        head={head}
        deposit={true}
        max={max}
        unit={unit}
        val={val}
        setVal={setVal}
        precision={precision}
      />
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
          Deposit
        </BlueBtn>
      </div>
    </>
  );
};

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
