import { useUserAccount } from '@Hooks/useUserAccount';
import { useAtom } from 'jotai';
import { useContext } from 'react';
import { BlueBtn } from '@Views/Common/V2-Button';
import { Chain, useNetwork } from 'wagmi';
import { ConnectionRequired } from '@Views/Common/Navbar/AccountDropdown';
import { IMuchoTokenMarketData, indexAtom } from '../IndexAtom';
import { ViewContext } from '../market';
import { t } from 'i18next';

export const btnClasses = '!w-fit px-4 rounded-sm !h-7 m-auto';


const getModalButton = (caption: string, action: string, data: IMuchoTokenMarketData, state, setPageState) => {
  const key: string = caption;
  return <BlueBtn
    key={key}
    onClick={() =>
      setPageState({ ...state, activeModal: { title: caption, marketData: data }, isModalOpen: true, metadata: { action: action } })
    }
    className={btnClasses}
  >
    {caption}
  </BlueBtn>;
}

const GetBuyAndSellButtons = ({ data, state, setPageState }: { data: IMuchoTokenMarketData, state: any, setPageState: any }) => {
  //console.log("data", data);
  /*return <>
    {[<BlueBtn key="buyButton" className={btnClasses} onClick={() => { }} isDisabled={true}>Temporarily disabled</BlueBtn>]}
  </>*/
  return <>
    {
      [
        data.buyTokenInWallet > 0 ? getModalButton(t("index.Buy mIndex"), "BUY", data, state, setPageState) : <BlueBtn key="buyButton" className={btnClasses} onClick={() => { }} isDisabled={true}>{t("index.NoCoins", { token: data.buyTokenSymbol })}</BlueBtn>,
        data.userBalance > 0 ? getModalButton(t("index.Sell mIndex"), "SELL", data, state, setPageState) : <BlueBtn key="sellButton" className={btnClasses} onClick={() => { }} isDisabled={true}>{t("index.NoCoins", { token: "mIndex" })}</BlueBtn>,
      ]
    }
  </>;
}

export function IndexMarketButtons({ data }: { data: IMuchoTokenMarketData }) {
  const { address: account } = useUserAccount();
  const [state, setPageState] = useAtom(indexAtom);
  const { chain } = useNetwork();

  let activeChain: Chain | null = null;
  const contextValue = useContext(ViewContext);
  if (contextValue) {
    activeChain = contextValue.activeChain;
  }

  //console.log("------activeChain-------------", activeChain);

  if (!account || !activeChain || activeChain.id !== chain?.id)
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
      <GetBuyAndSellButtons data={data} state={state} setPageState={setPageState} />
    </div>
  </>
  );

}