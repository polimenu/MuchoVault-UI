import { useAtom } from 'jotai';
import { useContext, useState } from 'react';
import BufferInput from '@Views/Common/BufferInput';
import { Display } from '@Views/Common/Tooltips/Display';
import { BlueBtn } from '@Views/Common/V2-Button';
import { useAirdropInteractionCalls } from '../Hooks/useAirdropInteractionCalls';
import { toFixed } from '@Utils/NumString';
import { getPosInf, gt, gte } from '@Utils/NumString/stringArithmatics';
import { useGlobal } from '@Contexts/Global';
import { useToast } from '@Contexts/Toast';
import { ViewContext } from '..';
import { erc20ABI, useContractRead } from 'wagmi';
import { IContract } from 'src/Interfaces/interfaces';
import { useGetAllowance, useGetApprovalAmount } from '../../Common/Hooks/useAllowanceCall';
import { IMuchoAirdropManagerData, v2ContractDataAtom } from '../AirdropAtom';
import { MAIDROP_CONFIG } from '../Config/mAirdropConfig';
import { getBNtoStringCopy } from '@Utils/useReadCall';
import { BigNumber } from 'ethers';

export const AirdropBuyModal = ({
  head
}: {
  head: string;
}) => {

  const [pageState] = useAtom(v2ContractDataAtom);
  const activeModal = pageState.activeModal;
  const { activeChain } = useContext(ViewContext);

  const data: IMuchoAirdropManagerData = activeModal.data;
  const { buyCall } = useAirdropInteractionCalls(data);

  return (
    <Buy
      data={data}
      call={buyCall}
    />
  );
};

const Common = ({ val, setVal, head, max, unit, precision }) => {
  return (
    <div>
      <div className="text-f15 mb-5">{head}</div>
      <BufferInput
        header={
          <div className="flex flex-row justify-between w-full text-3 text-f14 mt-2">
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
            error: 'Not enough funds!',
          },
          min: { val: '0', error: 'Enter a positive value' },
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



const Buy = ({ data, call }: { data: IMuchoAirdropManagerData, call: any }) => {
  //console.log("DEPOSIT CALL:"); console.log(call);
  const [val, setVal] = useState('');
  const { activeChain } = useContext(ViewContext);
  const tokenContract: IContract = {
    abi: erc20ABI,
    contract: MAIDROP_CONFIG[activeChain.id].TokenPayment,
  };
  const { approve } = useGetApprovalAmount(
    tokenContract?.abi,
    tokenContract?.contract,
    MAIDROP_CONFIG[activeChain.id].ManagerContract
  );
  const toastify = useToast();
  const [approveState, setApprovalState] = useState(false);
  const { state } = useGlobal();

  //console.log("Decimals:"); console.log(decimals);
  const allowance = useGetAllowance(MAIDROP_CONFIG[activeChain.id].TokenPayment, MAIDROP_CONFIG[activeChain.id].TokenPaymentDecimals, MAIDROP_CONFIG[activeChain.id]?.ManagerContract, activeChain.id);
  //console.log("Allowance", allowance, V2USER_CONFIG[activeChain.id]?.MuchoHub.contract);

  const isApproved = gte(Number(allowance), val || '1');

  const clickHandler = () => {
    return call(val);
  };


  return (
    <>
      <Common
        head={"Buy mAirdrop"}
        max={(data.mAirdropMaxSupply - data.mAirdropCurrentSupply) * data.price}
        unit={MAIDROP_CONFIG[activeChain.id].TokenPaymentSymbol}
        val={val}
        setVal={setVal}
        precision={2}
      />
      <div className="flex whitespace-nowrap mt-5">
        <BlueBtn
          onClick={() => approve(toFixed(val * (10 ** MAIDROP_CONFIG[activeChain.id].TokenPaymentDecimals), 0), setApprovalState)}
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
          Buy mAirdrop
        </BlueBtn>
      </div>
    </>
  );
};
