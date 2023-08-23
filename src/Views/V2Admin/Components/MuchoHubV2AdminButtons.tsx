import { useUserAccount } from '@Hooks/useUserAccount';
import { useAtom } from 'jotai';
import { useContext } from 'react';
import { BlueBtn } from '@Views/Common/V2-Button';
import { useNetwork } from 'wagmi';
import { ConnectionRequired } from '@Views/Common/Navbar/AccountDropdown';
import { IHubTokenInfo, IMuchoHubData, IMuchoVaultData, IVaultInfo, v2ContractDataAtom, writeV2AdminData } from '../v2AdminAtom';
import { V2AdminContract, ViewContext } from '..';
import { useWriteCall } from '@Hooks/useWriteCall';
import { V2ADMIN_CONFIG } from '../Config/v2AdminConfig';
import MuchoHubAbi from '../Config/Abis/MuchoHub.json';
import { ethers } from 'ethers';

export const btnClasses = '!w-fit px-4 rounded-sm !h-7';

export function MuchoHubGeneralButtons({ data }: { data: IMuchoHubData }) {
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
      {getDirectButton("refreshAllInvestments", "Refresh All Investments", [])}
      {getModalButton("moveInvestment", "Move Investment", [], null, moveInvestmentValidation, "", true)}
      {getModalButton("refreshInvestment", "Refresh Protocol", [], null, () => { }, "", true)}
    </div>
  </>
  );

}

const moveInvestmentValidation = ([token, amount, source, destination, decimals]: [string, number, string, string, number]) => {
  const bnVal = ethers.BigNumber.from(10).pow(decimals).mul(Math.round(amount * 100)).div(100);
  return {
    error: false,
    toastifyMessage: null,
    valueToSC: [token, bnVal, source, destination, decimals],
  };
}

const getModalButton = (functionName: string, caption: string, args: any[], currentValue: any, validations: Function, unit: string, disabled: bool) => {
  const [state, setPageState] = useAtom(v2ContractDataAtom);
  const key: string = functionName + "_" + args.join("_");
  return <BlueBtn
    key={key}
    isDisabled={disabled}
    onClick={() =>
      setPageState({ ...state, activeModal: { title: caption, functionName: functionName, args: args, currentValue: currentValue, validations: validations, unit: unit, contract: V2AdminContract.MuchoHub }, isModalOpen: true })
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


export function MuchoHubTokenButtons({ data }: { data: IHubTokenInfo }) {
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
      {getModalButton("setDefaultInvestment", "Set Default Investment", [], null, () => { }, "", true)}
    </div>
  </>
  );

}



const getContractCall = (functionName: string, args: any[]) => {
  const { activeChain } = useContext(ViewContext);
  const { writeCall } = useWriteCall(V2ADMIN_CONFIG[activeChain?.id].MuchoHub.contract, MuchoHubAbi);
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