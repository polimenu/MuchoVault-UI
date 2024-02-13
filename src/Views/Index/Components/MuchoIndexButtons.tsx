import { useUserAccount } from '@Hooks/useUserAccount';
import { useAtom } from 'jotai';
import { useContext } from 'react';
import { BlueBtn } from '@Views/Common/V2-Button';
import { useNetwork } from 'wagmi';
import { ConnectionRequired } from '@Views/Common/Navbar/AccountDropdown';
import { IMuchoTokenLauncherData, indexAtom } from '../IndexAtom';
import { ViewContext } from '..';
import { MINDEX_CONFIG } from '../Config/mIndexConfig';
import { t } from 'i18next';

export const btnClasses = '!w-fit px-4 rounded-sm !h-7 m-auto';


const getModalButton = (caption: string, data: IMuchoTokenLauncherData, tokenPrice: string, state, setPageState) => {
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

const GetDepositButtons = ({ data, state, setPageState }: { data: IMuchoTokenLauncherData, state: any, setPageState: any }) => {
  //console.log("data", data);
  return <>
    {
      data.prices.map((p) => {
        return getModalButton(t("index.BuymIndexWith", { token: p.priceTokenSymbol }), data, p.priceTokenSymbol, state, setPageState);
      })
    }
  </>;
}

export function IndexButtons({ data }: { data: IMuchoTokenLauncherData }) {
  const { address: account } = useUserAccount();
  const [state, setPageState] = useAtom(indexAtom);
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
      {data.active && data.dateIni < Date.now() && data.dateEnd >= Date.now() && <GetDepositButtons data={data} state={state} setPageState={setPageState} />}
      {data.priceTokenInWallet == 0 && <BlueBtn key={"nocoins"} className={btnClasses} isDisabled={true}>{t("index.NoCoins", { token: MINDEX_CONFIG[activeChain.id].TokenPaymentSymbol })}</BlueBtn>}
    </div>
  </>
  );

}