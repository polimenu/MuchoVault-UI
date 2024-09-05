import { useUserAccount } from '@Hooks/useUserAccount';
import { useAtom } from 'jotai';
import { useContext } from 'react';
import { BlueBtn } from '@Views/Common/V2-Button';
import { useNetwork } from 'wagmi';
import { BadgeContext } from '..';
import { IPlanDetailed, badgeAtom } from '../badgeAtom';
import { ConnectionRequired } from '@Views/Common/Navbar/AccountDropdown';
import { t } from 'i18next';
import { useWriteCall } from '@Hooks/useWriteCall';
import { BADGE_CONFIG } from '../Config/BadgeConfig';
import MuchoNFTFetcherAbi from '../Config/Abis/MuchoNFTFetcher.json';
import MuchoNFTAbi from '../Config/Abis/MuchoNFT.json';
import { Divider } from '@Views/Common/Card/Divider';

export const btnClasses = '!w-fit px-4 rounded-sm !h-7 ml-auto';


export function SalePlanButtons({ data, showSaleText }: { data: IPlanDetailed, showSaleText: boolean }) {
  const { address: account } = useUserAccount();
  const { activeChain } = useContext(BadgeContext);
  const { chain } = useNetwork();

  //console.log("*******DRAWING PLAN BUTTONS*****", plan.id, CLOSED_PLANS, CLOSED_PLANS.find(p => p == plan.id));

  if (!account || activeChain.id !== chain?.id)
    return (
      <div className={btnClasses}>
        <ConnectionRequired>
          <></>
        </ConnectionRequired>
      </div>
    );

  //console.log("data", data);
  if (data.userBalance == 0) {
    return <SalePlanButtonsNotSubscribed data={data} showSaleText={showSaleText} />
  }

  return <SalePlanButtonsSubscribed data={data} />

}


function SalePlanButtonsNotSubscribed({ data, showSaleText }: { data: IPlanDetailed, showSaleText: boolean }) {
  const [state, setPageState] = useAtom(badgeAtom);

  //console.log("*******DRAWING PLAN BUTTONS*****", plan.id, CLOSED_PLANS, CLOSED_PLANS.find(p => p == plan.id));
  //console.log("data.planAttributes", data.planAttributes);
  //data.pricing.dateEnd
  //t("airdrop.Sales ended!")
  //console.log("dates", data.pricing.dateEnd.getTime(), (new Date()).getTime())
  let subscribeText = "Subscribirme";
  if (data.planAttributes.planName == "NFT Baby Scout") {
    subscribeText = "Inscribirme a la formación Baby Scout Verano 2024";
  }
  else if (data.id == 1) {
    subscribeText = "Inscribirme para tener acceso a TODAS las formaciones";
  }

  const priceEnded = (data.pricing.dateEnd.getTime() < ((new Date()).getTime()))
  return (<>
    <div className={`${btnClasses} flex gap-5 m-auto`}>

      {!priceEnded && <BlueBtn
        onClick={() =>
          setPageState({ ...state, activeModal: { saleData: data, action: "saleSubscribe" }, isModalOpen: true })
        }
        className={btnClasses}
      >
        {subscribeText}
      </BlueBtn>}
      {priceEnded && <BlueBtn className={btnClasses} onClick={() => { }} isDisabled={true}>{t("airdrop.Sales ended!")}</BlueBtn>}
    </div>
    {showSaleText && data.id == 1 && <><Divider />
      <div className={`${btnClasses} flex gap-5 mt-[20px] bold !w-full`}>
        INCLUIDO CON TU COMPRA:
      </div>
      <div className={`${btnClasses} flex gap-5 mt-[10px] !w-full`}>
        Acceso a la membresía del Campamento DeFi (12 meses de todas las formaciones impartidas en el Campamento)
      </div>
      <div className={`${btnClasses} flex gap-5 mt-[20px] !w-full`}>
        NFT con poderes especiales
      </div>
    </>}
  </>
  );
}

const getRenewCall = (nftId: string) => {
  const { activeChain } = useContext(BadgeContext);
  const { writeCall } = useWriteCall(BADGE_CONFIG[activeChain.id].MuchoNFTFetcher, MuchoNFTFetcherAbi);
  const [state, setPageState] = useAtom(badgeAtom);

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
    writeCall(callBack, "renew", [nftId]);
  }

  return myCall;
};


function SalePlanButtonsSubscribed({ data }: { data: IPlanDetailed }) {
  const [state, setPageState] = useAtom(badgeAtom);

  //console.log("data", data);
  const call = getRenewCall(data.id.toString());

  if (data.tokenIdAttributes.remainingDays < 5 && data.renewalPricing.userPrice.amount > 0) {
    return <div className={`${btnClasses} flex gap-5 m-auto`}>
      <BlueBtn
        onClick={() => {
          setPageState({ ...state, activeModal: { plan: data, action: "saleRenew" }, isModalOpen: true })
        }
        }
        className={btnClasses}
      >
        Renovar acceso por {data.planAttributes.duration} días
      </BlueBtn>
    </div >
  }

  return (
    <div className={`${btnClasses} flex gap-5 m-auto`}>
      <BlueBtn
        onClick={() => {
          setPageState({ ...state, activeModal: { plan: data, action: "transfer" }, isModalOpen: true })
        }
        }
        className={btnClasses}
      >
        Enviar mi NFT a otra dirección
      </BlueBtn>
    </div>
  );
}