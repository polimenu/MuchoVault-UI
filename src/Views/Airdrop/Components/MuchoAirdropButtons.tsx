import { useUserAccount } from '@Hooks/useUserAccount';
import { useAtom } from 'jotai';
import { useContext } from 'react';
import { BlueBtn } from '@Views/Common/V2-Button';
import { useNetwork } from 'wagmi';
import { ConnectionRequired } from '@Views/Common/Navbar/AccountDropdown';
import { IMuchoAirdropManagerData, v2ContractDataAtom } from '../AirdropAtom';
import { ViewContext } from '..';
import { MAIDROP_CONFIG } from '../Config/mAirdropConfig';
import { useTranslation } from 'react-i18next';

export const btnClasses = '!w-fit px-4 rounded-sm !h-7 ml-auto';


const getModalButton = (caption: string, data: IMuchoAirdropManagerData, state, setPageState) => {
  const key: string = caption;
  return <BlueBtn
    key={key}
    onClick={() =>
      setPageState({ ...state, activeModal: { title: caption, data: data }, isModalOpen: true })
    }
    className={btnClasses}
  >
    {caption}
  </BlueBtn>;
}


export function AirdropButtons({ data }: { data: IMuchoAirdropManagerData }) {
  const { address: account } = useUserAccount();
  const [state, setPageState] = useAtom(v2ContractDataAtom);
  const { activeChain } = useContext(ViewContext);
  const { chain } = useNetwork();
  const { t } = useTranslation();

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
      {data.active && data.dateIni < Date.now() && data.dateEnd >= Date.now() && data.mAirdropCurrentSupply < data.mAirdropMaxSupply > 0 && data.priceTokenInWallet > 0 && getModalButton(t("airdrop.Buy my mAirdrops now"), data, state, setPageState)}
      {data.priceTokenInWallet == 0 && <BlueBtn key={"nocoins"} className={btnClasses} isDisabled={true}>{t("airdrop.NoCoins", { token: MAIDROP_CONFIG[activeChain.id].TokenPaymentSymbol })}</BlueBtn>}
    </div>
  </>
  );

}