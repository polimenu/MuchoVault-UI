import { useAtom } from 'jotai';
import { useContext, useState } from 'react';
import BufferInput from '@Views/Common/BufferInput';
import { Display } from '@Views/Common/Tooltips/Display';
import { BlueBtn } from '@Views/Common/V2-Button';
import { earnAtom } from '../earnAtom';
import {
  useEarnWriteCalls,
  useGetApprovalAmount,
} from '../Hooks/useEarnWriteCalls';
import { CONTRACTS } from '../Config/Address';
import { toFixed } from '@Utils/NumString';
import { getPosInf, gt, gte } from '@Utils/NumString/stringArithmatics';
import { useGlobal } from '@Contexts/Global';
import { useToast } from '@Contexts/Toast';
import { Skeleton } from '@mui/material';
import { EarnContext } from '..';
import { IContract } from 'src/Interfaces/interfaces';

export const DepositModal = ({
  inWallet,
  staked,
  maxCap,
  totalStaked,
  head,
  deposit,
  tokenContract,
  unit,
  allowance,
  vaultId,
  decimals,
  precision,
  muchoConversion
}: {
  inWallet: string;
  staked: string;
  maxCap: string;
  totalStaked: string;
  head: string;
  deposit: boolean;
  tokenContract?: IContract;
  unit: string;
  allowance?: string;
  vaultId: number;
  decimals: number;
  precision: number;
  muchoConversion: number;
}) => {
  //console.log("Allowance: " + allowance)
  const { validations, depositCall, withdrawCall } = useEarnWriteCalls(vaultId, decimals);

  /*if (!inWallet || !staked)
    return (
      <Skeleton
        variant="rectangular"
        className="w-[350px] sm:w-full !h-8 !transform-none"
      />
    );*/
  //console.log("Staked: " + staked)
  if (deposit) {
    /*console.log("DEPOSIT!");
    console.log(Number(inWallet));
    console.log(Number(maxCap));
    console.log(Number(staked));
    console.log(Number(Math.min(Number(inWallet), Number(maxCap - totalStaked))));*/
    const maxToDeposit = Number(Math.min(Number(inWallet), Number(maxCap - totalStaked)));
    return (
      <Deposit
        head={head}
        max={maxToDeposit}
        unit={unit}
        tokenContract={tokenContract}
        allowance={allowance}
        validations={validations}
        call={depositCall}
        precision={precision}
      />
    );
  }
  else return <Withdraw head={head} max={staked} unit={unit} validations={validations} call={withdrawCall} precision={precision} muchoConversion={muchoConversion} />;
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

const Deposit = ({ tokenContract, max, head, unit, allowance, validations, call, precision }) => {
  //console.log("DEPOSIT CALL:"); console.log(call);
  const [val, setVal] = useState('');
  const { activeChain } = useContext(EarnContext);
  const { approve } = useGetApprovalAmount(
    tokenContract?.abi,
    tokenContract?.contract,
    CONTRACTS[activeChain.id]?.MuchoVault
  );
  const [pageState] = useAtom(earnAtom);
  const toastify = useToast();
  const [approveState, setApprovalState] = useState(false);
  const { state } = useGlobal();
  const isApproved = gte(allowance, val || '1');

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
