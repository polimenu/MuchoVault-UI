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
import MuchoVaultABI from '../Config/Abis/MuchoVault.json';
import { useToast } from '@Contexts/Toast';
import { ethers } from 'ethers';

export const btnClasses = '!w-fit px-4 rounded-sm !h-7';


const getModalButton = (caption: string, vaultInfo: IVaultInfo, deposit: boolean, swap: boolean, destVaultId: number) => {
  const [state, setPageState] = useAtom(v2ContractDataAtom);
  const key: string = caption + "_" + vaultInfo.id;
  return <BlueBtn
    key={key}
    onClick={() =>
      setPageState({ ...state, activeModal: { title: caption, vaultInfo: vaultInfo, deposit: deposit, swap: swap, destVaultId: destVaultId }, isModalOpen: true })
    }
    className={btnClasses}
  >
    {caption}
  </BlueBtn>;
}


export function VaultButtons({ data, muchoVaultData }: { data: IVaultInfo, muchoVaultData: IMuchoVaultData }) {
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
      {data.userData.depositTokens > 0 && getModalButton("Deposit", data, true, false, 0)}
      {data.userData.muchoTokens > 0 && getModalButton("Withdraw", data, false, false, 0)}
      {/*data.userData.muchoTokens > 0 &&
        muchoVaultData.vaultsInfo.filter(v => v.id != data.id).map(v => getModalButton(`Swap to ${v.depositToken.name}`, data, false, true, v.id))
      */}
    </div>
  </>
  );

}