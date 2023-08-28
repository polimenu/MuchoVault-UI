import { useAtom } from 'jotai';
import { useContext, useState } from 'react';
import BufferInput from '@Views/Common/BufferInput';
import { Display } from '@Views/Common/Tooltips/Display';
import { BlueBtn } from '@Views/Common/V2-Button';
import { useVaultInteractionCalls } from '../Hooks/useVaultInteractionCalls';
import { toFixed } from '@Utils/NumString';
import { getPosInf, gt, gte } from '@Utils/NumString/stringArithmatics';
import { useGlobal } from '@Contexts/Global';
import { useToast } from '@Contexts/Toast';
import { ViewContext } from '..';
import { erc20ABI } from 'wagmi';
import { IContract } from 'src/Interfaces/interfaces';
import { useGetAllowance, useGetApprovalAmount } from '../../Common/Hooks/useAllowanceCall';
import { IVaultInfo, v2ContractDataAtom } from '../v2AdminAtom';
import { V2USER_CONFIG } from '../Config/v2UserConfig';

export const V2DepositModal = ({
  head
}: {
  head: string;
}) => {

  const [pageState] = useAtom(v2ContractDataAtom);
  const activeModal = pageState.activeModal;
  const { activeChain } = useContext(ViewContext);

  const vaultInfo: IVaultInfo = activeModal.vaultInfo;
  const { validations, depositCall, withdrawCall } = useVaultInteractionCalls(vaultInfo.id, vaultInfo.decimals);

  if (activeModal.deposit) {

    const maxToDeposit = Number(Math.min(Number(vaultInfo.userData.depositTokens), Number(vaultInfo.maxCap - vaultInfo.totalStaked), Number(vaultInfo.maxDepositUser)));
    const tokenContract: IContract = {
      abi: erc20ABI,
      contract: vaultInfo.depositToken.contract
    };
    return (
      <Deposit
        head={head}
        max={maxToDeposit}
        unit={vaultInfo.depositToken.name}
        tokenContract={tokenContract}
        validations={validations}
        call={depositCall}
        precision={4}
        decimals={vaultInfo.decimals}
      />
    );
  }
  else {
    const muchoConversion = Number(vaultInfo.totalStaked) > 0 ? Number(vaultInfo.muchoToken.supply / vaultInfo.totalStaked) : 1
    const staked = Number(vaultInfo.muchoToken.supply) > 0 ? Number(vaultInfo.userData.muchoTokens * vaultInfo.totalStaked / vaultInfo.muchoToken.supply) : 0;

    return <Withdraw head={head} max={staked} unit={vaultInfo.depositToken.name} validations={validations} call={withdrawCall} precision={4} muchoConversion={muchoConversion} />;
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
  const { activeChain } = useContext(ViewContext);
  const { approve } = useGetApprovalAmount(
    tokenContract?.abi,
    tokenContract?.contract,
    V2USER_CONFIG[activeChain.id]?.MuchoHub.contract
  );
  const toastify = useToast();
  const [approveState, setApprovalState] = useState(false);
  const { state } = useGlobal();

  //console.log("Decimals:"); console.log(decimals);
  const allowance = useGetAllowance(tokenContract.contract, decimals, V2USER_CONFIG[activeChain.id]?.MuchoHub.contract, activeChain.id);
  //console.log("Allowance", allowance, V2USER_CONFIG[activeChain.id]?.MuchoHub.contract);

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
          onClick={() => approve(toFixed(val * (10 ** decimals), 0), setApprovalState)}
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
  const [pageState] = useAtom(v2ContractDataAtom);
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
