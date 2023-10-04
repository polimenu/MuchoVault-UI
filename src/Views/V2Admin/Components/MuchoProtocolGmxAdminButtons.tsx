import { useUserAccount } from '@Hooks/useUserAccount';
import { useAtom } from 'jotai';
import { useContext } from 'react';
import { BlueBtn } from '@Views/Common/V2-Button';
import { useNetwork } from 'wagmi';
import { ConnectionRequired } from '@Views/Common/Navbar/AccountDropdown';
import { IGmxTokenInfo, IMuchoProtocolGmxData, v2ContractDataAtom, writeV2AdminData } from '../v2AdminAtom';
import { V2AdminContract, ViewContext } from '..';
import { useWriteCall } from '@Hooks/useWriteCall';
import { V2ADMIN_CONFIG } from '../Config/v2AdminConfig';
import MuchoGmxAbi from '../Config/Abis/MuchoProtocolGmx.json';
import { ethers } from 'ethers';

export const btnClasses = '!w-fit px-4 rounded-sm !h-7';

export function MuchoGmxGeneralButtons({ data }: { data: IMuchoProtocolGmxData }) {
  const { address: account } = useUserAccount();
  const { activeChain } = useContext(ViewContext);
  const { chain } = useNetwork();

  if (!account || activeChain.id !== chain?.id)
    return (
      <div className={btnClasses}>
        <ConnectionRequired>
          <></>
        </ConnectionRequired>
      </div>
    );

  return (<>
    <div className="flex gap-5">
      {getModalButton("updateGlpApr", "GLP APR", [], data.glpApr, numberValidation(0, 100, 2), "%", false)}
      {getModalButton("updateGlpWethMintFee", "WETH Mint Fee", [], data.glpWethMintFee, numberValidation(0, 100, 2), "%", false)}
      {getModalButton("setSlippage", "Slippage", [], data.slippage, numberValidation(0, 100, 3), "%", false)}
      {!data.claimEsGmx && getDirectButton("updateClaimEsGMX", "Claim EsGmx", [true])}
      {data.claimEsGmx && getDirectButton("updateClaimEsGMX", "Stop Claim EsGmx", [false])}
    </div>
    <br></br>
    <div className="flex gap-5">
      {getModalButton("setMinNotInvestedPercentage", "Min Not Invested", [], data.minNotInvestedPercentage, numberValidation(0, 100, 2), "%", false)}
      {getModalButton("setDesiredNotInvestedPercentage", "Desired Not Invested", [], data.desiredNotInvestedPercentage, numberValidation(0, 100, 2), "%", false)}
      {getModalButton("setMinWeightBasisPointsMove", "Min Move", [], data.minBasisPointsMove, numberValidation(0, 100, 2), "%", false)}
    </div>
    <br></br>
    <div className="flex gap-5">
      {getModalButton("setMaxRefreshWeightLapse", "Max No Refresh Lapse", [], data.maxRefreshWeightLapse, hourValidation(1, 24 * 7, 0), "h", false)}
    </div>
    <br></br>
    <br></br>
    <div className="flex gap-5">
      {!data.manualModeWeights && getDirectButton("setManualModeWeights", "Manual Weights", [true])}
      {data.manualModeWeights && getDirectButton("setManualModeWeights", "Auto Weights", [false])}
      {getModalButton("setRewardPercentages", "Owner Percentage", [], data.rewardSplit.ownerPercentage, ownerFeeValidation(0, 100, 2, data.rewardSplit.NftPercentage), "%", false)}
      {getModalButton("setRewardPercentages", "NFT Percentage", [], data.rewardSplit.NftPercentage, nftFeeValidation(0, 100, 2, data.rewardSplit.ownerPercentage), "%", false)}
    </div>
    <br></br>
    <br></br>
    <div className="flex gap-5">
      {getDirectButton("refreshInvestment", "Refresh Investment", [])}
      {getDirectButton("cycleRewards", "Cycle Rewards", [])}
    </div>
  </>
  );

}

export function MuchoGmxTokenButtons({ data, manualWeights }: { data: IGmxTokenInfo, manualWeights: boolean }) {
  const { address: account } = useUserAccount();
  const { activeChain } = useContext(ViewContext);
  const { chain } = useNetwork();

  if (!account || activeChain.id !== chain?.id)
    return (
      <div className={btnClasses}>
        <ConnectionRequired>
          <></>
        </ConnectionRequired>
      </div>
    );

  return (<>
    <div className="flex gap-5">
      {manualWeights && getModalButton("setWeight", "Set Token Weight", [data.token.contract], data.desiredWeight, numberValidation(0, 100, 2), "%", false)}
    </div>
  </>
  );

}



const getModalButton = (functionName: string, caption: string, args: any[], currentValue: any, validations: Function, unit: string, disabled: bool) => {
  const [state, setPageState] = useAtom(v2ContractDataAtom);
  const key: string = caption.replaceAll(" ", "") + "_" + args.join("_");
  return <BlueBtn
    key={key}
    isDisabled={disabled}
    onClick={() =>
      setPageState({ ...state, activeModal: { title: caption, functionName: functionName, args: args, currentValue: currentValue, validations: validations, unit: unit, contract: V2AdminContract.MuchoProtocolGmx }, isModalOpen: true })
    }
    className={btnClasses}
  >
    {caption}
  </BlueBtn>;
}

const getDirectButton = (functionName: string, caption: string, args: any[]) => {
  const call = getContractCall(functionName, args);
  return <BlueBtn
    onClick={() =>
      call()
    }
    className={btnClasses}
  >
    {caption}
  </BlueBtn>;
}

const numberValidation = (min: number, max: number, decimals: number) => {
  return (val: number) => {
    if (val < min || val > max) {
      return {
        error: true,
        toastifyMessage: {
          type: 'error',
          msg: `Value must be between ${min} and ${max}`,
          id: 'invalidNumber',
        },
        valueToSC: null,
      };
    }
    const bnVal = ethers.BigNumber.from(10).pow(decimals).mul(Math.round(val * 100)).div(100);
    return { error: false, toastifyMessage: null, valueToSC: bnVal };
  }
}

const ownerFeeValidation = (min: number, max: number, decimals: number, nftPercentage: number) => {
  return (val: number) => {
    if (val < min || val > max) {
      return {
        error: true,
        toastifyMessage: {
          type: 'error',
          msg: `Value must be between ${min} and ${max}`,
          id: 'invalidNumber',
        },
        valueToSC: null,
      };
    }
    const bnVal = ethers.BigNumber.from(10).pow(decimals).mul(Math.round(val * 100)).div(100);
    return { error: false, toastifyMessage: null, valueToSC: { ownerPercentage: bnVal, NftPercentage: nftPercentage * 100 } };
  }
}

const nftFeeValidation = (min: number, max: number, decimals: number, ownerPercentage: number) => {
  return (val: number) => {
    if (val < min || val > max) {
      return {
        error: true,
        toastifyMessage: {
          type: 'error',
          msg: `Value must be between ${min} and ${max}`,
          id: 'invalidNumber',
        },
        valueToSC: null,
      };
    }
    const bnVal = ethers.BigNumber.from(10).pow(decimals).mul(Math.round(val * 100)).div(100);
    return { error: false, toastifyMessage: null, valueToSC: { ownerPercentage: ownerPercentage * 100, NftPercentage: bnVal } };
  }
}


const hourValidation = (min: number, max: number, decimals: number) => {

  return (val: number) => {
    if (val < min || val > max) {
      return {
        error: true,
        toastifyMessage: {
          type: 'error',
          msg: `Value must be between ${min} and ${max}`,
          id: 'invalidNumber',
        },
        valueToSC: null,
      };
    }
    val = val * 3600;
    const bnVal = ethers.BigNumber.from(10).pow(decimals).mul(Math.round(val * 100)).div(100);
    return { error: false, toastifyMessage: null, valueToSC: bnVal };
  }
}



const getContractCall = (functionName: string, args: any[]) => {
  const { activeChain } = useContext(ViewContext);
  const { writeCall } = useWriteCall(V2ADMIN_CONFIG[activeChain?.id].MuchoProtocolGmx.contract, MuchoGmxAbi);
  const [, setPageState] = useAtom(writeV2AdminData);

  function callBack(res) {
    //console.log("updatePlan:");
    //console.log(res);
    if (res.payload)
      setPageState({
        isModalOpen: false,
        activeModal: null,
      });
  }

  function myCall() {
    //console.log("Sending call");
    writeCall(callBack, functionName, args);
  }

  return myCall;
};