import { useUserAccount } from '@Hooks/useUserAccount';
import { useAtom } from 'jotai';
import { useContext } from 'react';
import { BlueBtn } from '@Views/Common/V2-Button';
import { useNetwork } from 'wagmi';
import { ConnectionRequired } from '@Views/Common/Navbar/AccountDropdown';
import { IMuchoVaultData, IVaultInfo, v2ContractDataAtom, writeV2AdminData } from '../v2AdminAtom';
import { ViewContext } from '..';
import { useWriteCall } from '@Hooks/useWriteCall';
import { V2USER_CONFIG } from '../Config/v2UserConfig';
import MuchoRewardRouterAbi from '../Config/Abis/MuchoRewardRouter.json';
import MuchoVaultAbi from '../Config/Abis/MuchoVault.json';
import ERC20Abi from '../Config/Abis/ERC20Ext.json';
import { useToast } from '@Contexts/Toast';
import { ethers } from 'ethers';

export const btnClasses = '!w-fit px-4 rounded-sm !h-7';



const getDirectButton = (call: any, caption: string) => {

  return <BlueBtn
    onClick={() =>
      call()
    }
    className={btnClasses}
  >
    {caption}
  </BlueBtn>;
}

const getMuchoVaultCall = (functionName: string, args: any[], cBack: any) => {
  const { activeChain } = useContext(ViewContext);
  return getContractCall(V2USER_CONFIG[activeChain?.id].MuchoVault.contract, MuchoVaultAbi, functionName, args, cBack);
};

const getMuchoRewardCall = (functionName: string, args: any[], cBack: any) => {
  const { activeChain } = useContext(ViewContext);
  return getContractCall(V2USER_CONFIG[activeChain?.id].MuchoRewardRouter.contract, MuchoRewardRouterAbi, functionName, args, cBack);
};


const getContractCall = (contract: string, abi: any, functionName: string, args: any[], cBack: any) => {
  const { writeCall } = useWriteCall(contract, abi);
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

  if (!cBack)
    cBack = callBack;

  function myCall() {
    //console.log("Sending call");
    writeCall(cBack, functionName, args);
  }

  return myCall;
};


export function NFTButtons({ data }: { data: IMuchoVaultData }) {
  const { address: account } = useUserAccount();
  const [state, setPageState] = useAtom(v2ContractDataAtom);
  const { activeChain } = useContext(ViewContext);
  const { chain } = useNetwork();
  const rewardsToken = V2USER_CONFIG[activeChain.id].MuchoRewardRouter.rewardsToken;
  const compoundVault = data.vaultsInfo.find(v => v.depositToken.contract == rewardsToken).id;
  const compoundAmount = data.badgeInfo.userBadgeData.currentRewards.amount * (10 ** data.vaultsInfo[compoundVault].depositToken.decimals);
  const compoundCall = getMuchoVaultCall("deposit", [compoundVault, compoundAmount], null);
  const approveAndCompoundCall = getContractCall(rewardsToken, ERC20Abi, "approve", [V2USER_CONFIG[activeChain?.id].MuchoHub.contract, compoundAmount], compoundCall)
  const withdrawAndCompoundCall = getMuchoRewardCall("withdrawToken", [rewardsToken], approveAndCompoundCall); //ToDo approve first
  const withdrawCall = getMuchoRewardCall("withdrawToken", [rewardsToken], null);


  if (!account || activeChain.id !== chain?.id)
    return (
      <div className={btnClasses}>
        <ConnectionRequired>
          <></>
        </ConnectionRequired>
      </div>
    );

  //console.log("Max Cap", id, data.maxCap);

  return (<>
    <div className="flex gap-5">
      {data.badgeInfo.userBadgeData.planId == 0 && <BlueBtn key={"subscribe"} onClick={() => window.open("https://mucho.finance/#/badge")} className={btnClasses}>Subscribe and earn rewards</BlueBtn>}
      {data.badgeInfo.userBadgeData.currentRewards.amount > 0 && getDirectButton(withdrawCall, "Harvest")}
      {data.badgeInfo.userBadgeData.currentRewards.amount > 0 && getDirectButton(withdrawAndCompoundCall, "Compound*")}
      {/*data.userData.muchoTokens > 0 &&
        muchoVaultData.vaultsInfo.filter(v => v.id != data.id).map(v => getModalButton(`Swap to ${v.depositToken.name}`, data, false, true, v.id))
      */}
    </div>
    {data.badgeInfo.userBadgeData.currentRewards.amount > 0 && <div className='flex gap-5 mt-5 text-f12'>
      *You will be asked to sign 3 transactions, to harvest your rewards and deposit them on WETH vault
    </div>}
  </>
  );

}