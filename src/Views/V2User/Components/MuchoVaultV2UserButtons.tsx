import { useUserAccount } from '@Hooks/useUserAccount';
import { useAtom } from 'jotai';
import { useContext } from 'react';
import { BlueBtn } from '@Views/Common/V2-Button';
import { useNetwork } from 'wagmi';
import { ConnectionRequired } from '@Views/Common/Navbar/AccountDropdown';
import { IVaultInfo, v2ContractDataAtom } from '../v2AdminAtom';
import { ViewContext } from '..';
import { t } from 'i18next';

export const btnClasses = '!w-fit px-4 rounded-sm !h-7 ml-auto';


const getModalButton = (caption: string, vaultInfo: IVaultInfo, deposit: boolean, swap: boolean, destVaultId: number, state, setPageState) => {
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

  return (<>
    <div className={`${btnClasses} flex gap-5`}>
      {data.userData.depositTokens == 0 && <BlueBtn onClick={() => { }} className={btnClasses} isDisabled={true}>{t("v2.No tokens in your wallet", { token: data.depositToken.name })}</BlueBtn>}
      {data.userData.depositTokens > 0 && getModalButton(t("v2.Deposit"), data, true, false, 0, state, setPageState)}
      {data.userData.muchoTokens > 0 && getModalButton(t("v2.Withdraw"), data, false, false, 0, state, setPageState)}
    </div>
  </>
  );

}