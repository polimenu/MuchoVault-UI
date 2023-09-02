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
import { erc20ABI, useContractRead } from 'wagmi';
import { IContract } from 'src/Interfaces/interfaces';
import { useGetAllowance, useGetApprovalAmount } from '../../Common/Hooks/useAllowanceCall';
import { IMuchoVaultData, IVaultInfo, v2ContractDataAtom } from '../v2AdminAtom';
import { V2USER_CONFIG } from '../Config/v2UserConfig';
import MuchoVaultAbi from '../Config/Abis/MuchoVault.json';
import { getBNtoStringCopy } from '@Utils/useReadCall';
import { BigNumber, BigNumberish, ethers } from 'ethers';
import { useUserAccount } from '@Hooks/useUserAccount';

export const V2SwapModal = ({
  dVaultId, data
}: {
  dVaultId: number | null,
  data: IMuchoVaultData
}) => {

  const [pageState] = useAtom(v2ContractDataAtom);
  const activeModal = pageState.activeModal;
  const { activeChain } = useContext(ViewContext);

  //console.log("Chain", activeChain);

  const vaultInfo: IVaultInfo = activeModal.vaultInfo;
  const destVaultId = activeModal.destVaultId;
  const destVaultInfo: IVaultInfo = useGetDestVaultInfo(data, destVaultId);
  const { swapCall } = useVaultInteractionCalls(vaultInfo.id, vaultInfo.decimals);

  const sourceMTokenExchange = vaultInfo.totalStaked / vaultInfo.muchoToken.supply
  const destMTokenExchange = destVaultInfo.totalStaked / destVaultInfo.muchoToken.supply
  const max = Number(vaultInfo.userData.muchoTokens) * sourceMTokenExchange;
  const tokenContract: IContract = {
    abi: erc20ABI,
    contract: vaultInfo.depositToken.contract
  };

  //console.log("DEPOSIT CALL:"); console.log(call);
  const [val, setVal] = useState('');
  const destExpectedAmount = useGetDestinationExpectedAmount(vaultInfo, Number(val) / sourceMTokenExchange, destVaultInfo);
  const toastify = useToast();
  const { state } = useGlobal();
  const slippage = 0.005;

  const clickHandler = () => {
    if (destVaultInfo)
      return swapCall(Number(val) / sourceMTokenExchange, destVaultInfo, Number(destExpectedAmount) / destMTokenExchange, slippage);

    return false;
  };


  return (
    <>
      <div>
        <div className="text-f15 mb-5">Swap invested {vaultInfo.depositToken.name}</div>
        <div className="flex whitespace-nowrap mt-5 mb-7 text-f14">
          Move your deposited tokens from {vaultInfo.depositToken.name} to {destVaultInfo.depositToken.name} vault
        </div>
        <BufferInput
          header={
            <div className="flex flex-row justify-between w-full text-3 text-f14 mt-2">
              <span>From</span>
              <span className="flex flex-row items-center">
                Max:
                <Display data={max} precision={6} />
              </span>
            </div>
          }
          numericValidations={{
            decimals: { val: 6 },
            max: {
              val: max.toString(),
              error: 'Not enough funds!',
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
              {vaultInfo.depositToken.name}
            </span>
          }
        />
      </div>
      <br />
      <div>
        <BufferInput
          header={
            <div className="flex flex-row justify-between w-full text-3 text-f14 mt-2">
              <span>To</span>
            </div>
          }
          placeholder="0.0"
          bgClass="!bg-1"
          ipClass="mt-1"
          value={destExpectedAmount}
          isDisabled={true}
          unit={
            <span className="text-f16 flex justify-between w-fit">
              {destVaultInfo?.depositToken.name}
            </span>
          }
        />
      </div>
      <div className="flex whitespace-nowrap mt-5 text-f12">
        {getExchange(val, destExpectedAmount, vaultInfo.depositToken.name, destVaultInfo.depositToken.name, data.parametersInfo.userSwapFee)}
      </div>
      <div className="flex whitespace-nowrap mt-2 text-f12">
        Swap fee: {data.parametersInfo.userSwapFee} %
      </div>
      <div className="flex whitespace-nowrap mt-2 text-f12">
        Max slippage: {slippage * 100} %
      </div>
      <div className="flex whitespace-nowrap mt-5">
        <BlueBtn
          onClick={clickHandler}
          className="rounded"
        >
          Swap
        </BlueBtn>
      </div>
    </>
  );
};

const getExchange = (sourceAmount, destAmount, sourceToken, destToken, swapFee) => {
  if (sourceAmount == 0)
    return "";

  const conversionRate = (from: number, to: number, swapFee: number) => {
    return toFixed(to / (from * (1 - swapFee / 100)), 2);
  }

  if (destAmount > sourceAmount) {
    return `Exchange rate: 1 ${sourceToken} = ${conversionRate(sourceAmount, destAmount, swapFee)} ${destToken}`;
  }
  return `Exchange rate: 1 ${destToken} = ${conversionRate(destAmount, sourceAmount, swapFee)} ${sourceToken}`;
}

const useGetDestVaultInfo = (data: IMuchoVaultData, vaultId: number): IVaultInfo | undefined => {
  return data.vaultsInfo.find(v => v.id == vaultId);
}

const useGetDestinationExpectedAmount = (vaultInfo: IVaultInfo, mTokenSourceAmount: number, destVaultInfo: IVaultInfo) => {
  //return 17;
  if (!destVaultInfo)
    return "Loading...";

  const [pageState] = useAtom(v2ContractDataAtom);
  const { address: account } = useUserAccount();
  const { activeChain } = useContext(ViewContext);
  //console.log("Chain2", activeChain);
  //console.log("apr decimals", decimals);
  const bnVal: BigNumber = mTokenSourceAmount > 0 ? ethers.BigNumber.from(10).pow(vaultInfo.muchoToken.decimals).mul(Math.round(mTokenSourceAmount * 1E6)).div("1000000") : 1;

  //console.log("useGetDestinationExpectedAmount destVaultInfo", destVaultInfo);
  //console.log("Chain3", activeChain);
  //console.log("ChainId", activeChain.id);
  const call = {
    address: V2USER_CONFIG[activeChain.id].MuchoVault.contract,
    abi: MuchoVaultAbi,
    functionName: 'getSwap',
    args: [vaultInfo.id, bnVal, destVaultInfo.id],
    chainId: activeChain.Id,
    watch: true,
    overrides: { from: account },
  };
  //console.log("useGetDestinationExpectedAmount call", call, mTokenSourceAmount);

  let { data } = useContractRead(call);

  if (!data)
    return "Loading...";

  //console.log("useGetDestinationExpectedAmount call", call);
  //console.log("useGetDestinationExpectedAmount data", data);

  if (mTokenSourceAmount == 0)
    return "0";

  [data] = getBNtoStringCopy([data]);

  const destMTokenExchange = destVaultInfo.totalStaked / destVaultInfo.muchoToken.supply

  return toFixed((data / 10 ** destVaultInfo.muchoToken.decimals) * destMTokenExchange, 6);
}