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

export const btnClasses = '!w-fit px-4 rounded-sm !h-7 ml-auto !text-[18px]';


export function SalePlanButtons({ data }: { data: IPlanDetailed }) {
  const { address: account } = useUserAccount();
  let chainId = 42161;
  const badgeContextValue = useContext(BadgeContext);
  if (badgeContextValue) {
    chainId = badgeContextValue.activeChain.id;
  }
  const { chain } = useNetwork();

  //console.log("*******DRAWING PLAN BUTTONS*****", plan.id, CLOSED_PLANS, CLOSED_PLANS.find(p => p == plan.id));

  if (!account || chainId !== chain?.id)
    return (
      <div className={btnClasses}>
        <ConnectionRequired>
          <></>
        </ConnectionRequired>
      </div>
    );

  //console.log("data", data);
  if (data.userBalance == 0) {
    return <SalePlanButtonsNotSubscribed data={data} />
  }

  return <SalePlanButtonsSubscribed data={data} />

}


function SalePlanButtonsNotSubscribed({ data }: { data: IPlanDetailed }) {
  const [state, setPageState] = useAtom(badgeAtom);


  let subscribeText = "Subscribirme";
  if (data.id == 9) {
    subscribeText = "Inscribirme a la formación Baby Scout Otoño 2024";
  }
  else if (data.id == 1) {
    subscribeText = "Inscribirme para tener acceso a TODAS las formaciones";
  }
  else if (data.id == 8) {
    subscribeText = "Obtener mi NFT Libro Defi";
  }

  const priceNotStarted = (data.pricing.dateIni.getTime() > ((new Date()).getTime())) || !data.planAttributes.enabled;
  const priceEnded = (data.pricing.dateEnd.getTime() < ((new Date()).getTime()))
  return (<>
    <div className={`${btnClasses} flex gap-5 m-auto`}>

      {!priceEnded && !priceNotStarted && <BlueBtn
        onClick={() =>
          setPageState({ ...state, activeModal: { planId: data.id, action: "saleSubscribe" }, isModalOpen: true })
        }
        className={btnClasses}
      >
        {subscribeText}
      </BlueBtn>}
      {priceNotStarted && <BlueBtn className={btnClasses} onClick={() => { }} isDisabled={true}>No disponible todavía</BlueBtn>}
      {priceEnded && <BlueBtn className={btnClasses} onClick={() => { }} isDisabled={true}>{t("airdrop.Sales ended!")}</BlueBtn>}
    </div>
  </>
  );
}

const getRenewCall = (nftId: string) => {
  let chainId = 42161;
  const badgeContextValue = useContext(BadgeContext);
  if (badgeContextValue) {
    chainId = badgeContextValue.activeChain.id;
  }
  const { writeCall } = useWriteCall(BADGE_CONFIG[chainId].MuchoNFTFetcher, MuchoNFTFetcherAbi);
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

  if (data.id == 8) {
    return <div className={`${btnClasses} flex gap-5 m-auto`}>
      <BlueBtn
        onClick={() => { }}
        className={btnClasses}
        isDisabled={true}
      >
        Enhorabuena, ya tienes tu NFT Libro DeFi
      </BlueBtn>
    </div>
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