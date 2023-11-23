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
import { ethers } from 'ethers';
import { t } from 'i18next';

export const btnClasses = '!w-fit px-4 rounded-sm !h-7 ml-auto';



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
  const { activeChain } = useContext(ViewContext);
  const { chain } = useNetwork();
  const rewardsToken = V2USER_CONFIG[activeChain.id].MuchoRewardRouter.rewardsToken;
  const compoundVault = data.vaultsInfo.find(v => v.depositToken.contract == rewardsToken).id;
  const amount = data.badgeInfo.userBadgeData.currentRewards.amount;
  const compoundAmount = ethers.BigNumber.from(Math.floor(amount * (10 ** data.vaultsInfo[compoundVault].depositToken.decimals)).toString());
  //console.log("compoundAmount", compoundAmount);
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
  const harvestActive = data.badgeInfo.userBadgeData.currentRewards.amount > 0;

  return (<>
    <div className={`${btnClasses} flex gap-5`}>
      {data.badgeInfo.userBadgeData.planId == 0 && <BlueBtn key={"subscribe"} onClick={() => window.open("https://mucho.finance/#/badge")} className={btnClasses}>{t("v2.Subscribe and earn rewards")}</BlueBtn>}
      {harvestActive && getDirectButton(withdrawCall, t("v2.Harvest"))}
      {harvestActive && getDirectButton(withdrawAndCompoundCall, t("v2.Compound*"))}
      {/*data.userData.muchoTokens > 0 &&
        muchoVaultData.vaultsInfo.filter(v => v.id != data.id).map(v => getModalButton(`Swap to ${v.depositToken.name}`, data, false, true, v.id))
      */}
    </div>
    {harvestActive && <div className='flex gap-5 mt-5 text-f12'>
      {t("v2.CompoundNote")}
    </div>}
  </>
  );

}