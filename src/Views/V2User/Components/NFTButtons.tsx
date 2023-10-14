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

const getContractCall = (functionName: string, args: any[]) => {
  const { activeChain } = useContext(ViewContext);
  const { writeCall } = useWriteCall(V2USER_CONFIG[activeChain?.id].MuchoRewardRouter.contract, MuchoRewardRouterAbi);
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


export function NFTButtons({ data }: { data: IMuchoVaultData }) {
  const { address: account } = useUserAccount();
  const [state, setPageState] = useAtom(v2ContractDataAtom);
  const { activeChain } = useContext(ViewContext);
  const { chain } = useNetwork();
  const withdrawCall = getContractCall("withdraw", []);

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
      {/*data.badgeInfo.userBadgeData.currentRewards.amount > 0 && getDirectButton(withdrawCall, "Withdraw")*/}
      {/*data.userData.muchoTokens > 0 &&
        muchoVaultData.vaultsInfo.filter(v => v.id != data.id).map(v => getModalButton(`Swap to ${v.depositToken.name}`, data, false, true, v.id))
      */}
    </div>
  </>
  );

}