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

/*const getMuchoVaultCall = (contract: string, functionName: string, args: any[], cBack: any) => {
  return getContractCall(contract, MuchoVaultAbi, functionName, args, cBack);
};

const getMuchoRewardCall = (contract: string, functionName: string, args: any[], cBack: any) => {
  return getContractCall(contract, MuchoRewardRouterAbi, functionName, args, cBack);
};*/


const getContractCall = (writeCall: any, functionName: string, args: any[], cBack: any, setPageState: any) => {
  //const { writeCall } = useWriteCall(contract, abi);

  function callBack(res) {
    if (res.payload)
      setPageState({
        isModalOpen: false,
        activeModal: null,
      });
  }

  if (!cBack)
    cBack = callBack;

  function myCall() {
    writeCall(cBack, functionName, args);
  }

  return myCall;
};


export function NFTButtons({ data }: { data: IMuchoVaultData }) {
  const { address: account } = useUserAccount();
  const { activeChain } = useContext(ViewContext);
  const rewardsToken = V2USER_CONFIG[activeChain.id].MuchoRewardRouter.rewardsToken;
  const { chain } = useNetwork();
  const [, setPageState] = useAtom(writeV2AdminData);

  const { writeCall: writeVaultCall } = useWriteCall(V2USER_CONFIG[activeChain?.id].MuchoVault.contract, MuchoVaultAbi);
  const { writeCall: writeRewardTokenCall } = useWriteCall(rewardsToken, ERC20Abi);
  const writeRRCalls = [];
  for (const c of V2USER_CONFIG[activeChain.id].MuchoRewardRouter.contracts) {
    writeRRCalls[c] = useWriteCall(c, MuchoRewardRouterAbi).writeCall;
  }

  let previousWithdrawCall: any = null;
  let withdrawCall: any = null;
  for (const c of data.badgeInfo.userBadgeData.currentRewards.rewardContracts) {
    withdrawCall = getContractCall(writeRRCalls[c], "withdrawToken", [rewardsToken], previousWithdrawCall, setPageState);
    previousWithdrawCall = withdrawCall;
  }

  const compoundVault = data.vaultsInfo.find(v => v.depositToken.contract == rewardsToken).id;
  const compoundAmount = ethers.BigNumber.from(Math.floor(data.badgeInfo.userBadgeData.currentRewards.amount * (10 ** data.vaultsInfo[compoundVault].depositToken.decimals)).toString());
  //console.log("Compound vault and amount", compoundVault, compoundAmount);
  //console.log("writeRewardTokenCall", rewardsToken, ERC20Abi);

  const compoundCall = getContractCall(writeVaultCall, "deposit", [compoundVault, compoundAmount], null, setPageState);
  const approveAndCompoundCall = getContractCall(writeRewardTokenCall, "approve", [V2USER_CONFIG[activeChain?.id].MuchoHub.contract, compoundAmount], compoundCall, setPageState);
  let previousWithdrawAndCompoundCall: any = approveAndCompoundCall;
  let withdrawAndCompoundCall: any = null;
  for (const c of data.badgeInfo.userBadgeData.currentRewards.rewardContracts) {
    withdrawAndCompoundCall = getContractCall(writeRRCalls[c], "withdrawToken", [rewardsToken], previousWithdrawAndCompoundCall, setPageState);
    previousWithdrawAndCompoundCall = withdrawAndCompoundCall;
  }

  //withdrawAndCompoundCall = approveAndCompoundCall;

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
      {!data.badgeInfo.userBadgeData.active && <BlueBtn key={"subscribe"} onClick={() => window.open("https://mucho.finance/#/nft")} className={btnClasses}>{t("v2.Subscribe and earn rewards")}</BlueBtn>}
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