import { useUserAccount } from '@Hooks/useUserAccount';
import { useAtom } from 'jotai';
import { useContext } from 'react';
import { BlueBtn } from '@Views/Common/V2-Button';
import { useNetwork } from 'wagmi';
import { ConnectionRequired } from '@Views/Common/Navbar/AccountDropdown';
import { IMuchoAirdropManagerData, v2ContractDataAtom } from '../AirdropAtom';
import { ViewContext } from '..';
import { MAIDROP_CONFIG } from '../Config/mAirdropConfig';
import { t } from 'i18next';

export const btnClasses = '!w-fit px-4 rounded-sm !h-7 m-auto';


const getModalButton = (caption: string, data: IMuchoAirdropManagerData, tokenPrice: string, state, setPageState) => {
  const key: string = caption;
  return <BlueBtn
    key={key}
    onClick={() =>
      setPageState({ ...state, activeModal: { title: caption, data: data }, isModalOpen: true, metadata: { tokenPrice: tokenPrice } })
    }
    className={btnClasses}
  >
    {caption}
  </BlueBtn>;
}

const GetDepositButtons = ({ data, state, setPageState }: { data: IMuchoAirdropManagerData, state: any, setPageState: any }) => {
  //console.log("data", data);
  return <>
    {
      data.prices.map((p) => {
        return getModalButton(t("airdrop.BuymAirdropsWith", { token: p.priceTokenSymbol }), data, p.priceTokenSymbol, state, setPageState);
      })
    }
  </>;
}

export function AirdropButtons({ data }: { data: IMuchoAirdropManagerData }) {
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
    <div className="flex gap-5">
      {data.active && data.dateIni < Date.now() && data.dateEnd >= Date.now() && data.mAirdropCurrentSupply < data.mAirdropMaxSupply > 0
        && <GetDepositButtons data={data} state={state} setPageState={setPageState} />}
      {data.priceTokenInWallet == 0 && <BlueBtn key={"nocoins"} className={btnClasses} isDisabled={true}>{t("airdrop.NoCoins", { token: MAIDROP_CONFIG[activeChain.id].TokenPaymentSymbol })}</BlueBtn>}
    </div>
  </>
  );

}