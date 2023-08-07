import { useUserAccount } from '@Hooks/useUserAccount';
import { useAtom } from 'jotai';
import { useContext } from 'react';
import { BlueBtn } from '@Views/Common/V2-Button';
import { useNetwork } from 'wagmi';
import { ConnectionRequired } from '@Views/Common/Navbar/AccountDropdown';
import { IMuchoVaultData, IVaultInfo, v2ContractDataAtom, writeV2AdminData } from '../v2AdminAtom';
import { ViewContext } from '..';
import { useWriteCall } from '@Hooks/useWriteCall';
import { V2ADMIN_CONFIG } from '../Config/v2AdminConfig';
import MuchoVaultABI from '../Config/Abis/MuchoVault.json';
import { useToast } from '@Contexts/Toast';
import { ethers } from 'ethers';

export const btnClasses = '!w-fit px-4 rounded-sm !h-7';

export function MuchoVaultGeneralButtons({ data }: { data: IMuchoVaultData }) {
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
      {getDirectButton("updateAllVaults", "Update All Vaults", [])}
      {getDirectButton("refreshAndUpdateAllVaults", "Refresh & Update All Vaults", [])}
      {getDirectButton("setOpenAllVault", "Open All Vaults", [true])}
    </div>
    <br></br>
    <div className="flex gap-2">
      {getDirectButton("setOpenAllVault", "Close All Vaults", [false])}
      {getModalButton("setSwapMuchoTokensFee", "Swap Fee", [], data.parametersInfo.swapFee, numberValidation(0, 10, 2), "%")}
    </div>
    <br></br>
    <div className="flex gap-5">
      {data.parametersInfo.swapFeePlans.map(sfp => {
        return getModalButton("setSwapMuchoTokensFeeForPlan", `Plan ${sfp.planId} - Swap Fee`, [sfp.planId], sfp.swapFee, numberValidation(0, 10, 2), "%")
      })}
    </div>
  </>
  );

}

const getModalButton = (functionName: string, caption: string, args: any[], currentValue: any, validations: Function, unit: string) => {
  const [state, setPageState] = useAtom(v2ContractDataAtom);
  const key: string = functionName + "_" + args.join("_");
  return <BlueBtn
    key={key}
    onClick={() =>
      setPageState({ ...state, activeModal: { title: caption, functionName: functionName, args: args, currentValue: currentValue, validations: validations, unit: unit }, isModalOpen: true })
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


export function VaultButtons({ data }: { data: IVaultInfo }) {
  const { address: account } = useUserAccount();
  const [state, setPageState] = useAtom(v2ContractDataAtom);
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

  //console.log("Max Cap", id, data.maxCap);

  const id = data.id;

  return (<>
    <div className="flex gap-5">
      {data.stakable ? getDirectButton("setOpenVault", "Close Vault", [id, false]) : getDirectButton("setOpenVault", "Open Vault", [id, true])}
      {getDirectButton("updateVault", "Update Investment", [id])}
      {getModalButton("setMaxCap", "Max Cap", [id], data.maxCap, numberValidation(0, 1E18, data.decimals), data.depositToken.name)}
    </div>
    <br></br>
    <div className="flex gap-5">
      {getModalButton("setMaxDepositUser", "Max Deposit per User", [id], data.maxDepositUser, numberValidation(0, 1E18, data.decimals), data.depositToken.name)}
      {getModalButton("setDepositFee", "Deposit Fee", [id], data.depositFee, numberValidation(0, 5, 2), "%")}
      {getModalButton("setWithdrawFee", "Withdraw Fee", [id], data.withdrawFee, numberValidation(0, 1, 2), "%")}
    </div>
    <br></br>
    <div className="flex gap-5">
      {data.maxDepositPlans.map(mdp => {
        return getModalButton("setMaxDepositUserForPlan", `Plan ${mdp.planId} - Max Deposit per User`, [id, mdp.planId], mdp.maxDeposit, numberValidation(0, 1E18, data.decimals), data.depositToken.name)
      })}
    </div>
  </>
  );

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



const getContractCall = (functionName: string, args: any[]) => {
  const { activeChain } = useContext(ViewContext);
  const { writeCall } = useWriteCall(V2ADMIN_CONFIG[activeChain?.id].MuchoVault.contract, MuchoVaultABI);
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