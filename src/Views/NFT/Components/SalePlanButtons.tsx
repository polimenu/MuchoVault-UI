import { useUserAccount } from '@Hooks/useUserAccount';
import { useAtom } from 'jotai';
import { useContext } from 'react';
import { BlueBtn } from '@Views/Common/V2-Button';
import { useNetwork } from 'wagmi';
import { BadgeContext } from '../sale';
import { IPlan, badgeAtom } from '../badgeAtom';
import { ConnectionRequired } from '@Views/Common/Navbar/AccountDropdown';
import { usePlanEnableDisableCalls } from '../Hooks/usePlanWriteCalls';
import { t } from 'i18next';
import { useWriteCall } from '@Hooks/useWriteCall';
import { BADGE_CONFIG } from '../Config/BadgeConfig';
import MuchoNFTFetcherAbi from '../Config/Abis/MuchoNFTFetcher.json';
import { Divider } from '@Views/Common/Card/Divider';

export const btnClasses = '!w-fit px-4 rounded-sm !h-7 ml-auto';

const CLOSED_PLANS = [1, 5];

export function SalePlanButtons({ data }: { data: any }) {
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
    return <SalePlanButtonsNotSubscribed data={data} />
  }

  return <SalePlanButtonsSubscribed data={data} />

}


function SalePlanButtonsNotSubscribed({ data }: { data: any }) {
  const [state, setPageState] = useAtom(badgeAtom);

  //console.log("*******DRAWING PLAN BUTTONS*****", plan.id, CLOSED_PLANS, CLOSED_PLANS.find(p => p == plan.id));
  //console.log("data.planAttributes", data.planAttributes);
  //data.pricing.dateEnd
  //t("airdrop.Sales ended!")
  //console.log("dates", data.pricing.dateEnd.getTime(), (new Date()).getTime())
  const priceEnded = (data.pricing.dateEnd.getTime() < ((new Date()).getTime()))
  return (<>
    <div className={`${btnClasses} flex gap-5 m-auto`}>

      {!priceEnded && <BlueBtn
        onClick={() =>
          setPageState({ ...state, activeModal: { saleData: data, action: "saleSubscribe" }, isModalOpen: true })
        }
        className={btnClasses}
      >
        {data.planAttributes.planName == "NFT Baby Scout" ? "Inscribirme a la formación Baby Scout Verano 2024" :
          data.id == 1 ? "Inscribirme para tener acceso a TODAS las formaciones" : ""}
      </BlueBtn>}
      {priceEnded && <BlueBtn onClick={() => { }} isDisabled={true}>{t("airdrop.Sales ended!")}</BlueBtn>}
    </div>
    {data.id == 1 && <><Divider />
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

function SalePlanButtonsSubscribed({ data }: { data: any }) {

  //console.log("data", data);
  const call = getRenewCall(data.id);

  if (data.tokenIdAttributes.remainingDays < 5) {
    return <div className={`${btnClasses} flex gap-5 m-auto`}>
      <BlueBtn
        onClick={() => {
          call();
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
        onClick={() => { }}
        isDisabled={true}
        className={btnClasses}
      >
        ¡Enhorabuena, ya estás suscrito!
      </BlueBtn>
    </div >
  );
}