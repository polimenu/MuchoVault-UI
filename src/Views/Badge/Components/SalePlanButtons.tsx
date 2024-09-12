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

export const btnClasses = '!w-fit px-4 rounded-sm !h-7 ml-auto !text-[18px]';


export function SalePlanButtons({ data, showSaleText }: { data: IPlanDetailed, showSaleText: boolean }) {
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
    return <SalePlanButtonsNotSubscribed data={data} showSaleText={showSaleText} />
  }

  return <SalePlanButtonsSubscribed data={data} />

}


function SalePlanButtonsNotSubscribed({ data, showSaleText }: { data: IPlanDetailed, showSaleText: boolean }) {
  const [state, setPageState] = useAtom(badgeAtom);


  let subscribeText = "Subscribirme";
  if (data.planAttributes.planName == "NFT Baby Scout") {
    subscribeText = "Inscribirme a la formación Baby Scout Otoño 2024";
  }
  else if (data.id == 1) {
    subscribeText = "Inscribirme para tener acceso a TODAS las formaciones";
  }
  else if (data.id == 8) {
    subscribeText = "Obtener mi NFT Libro Defi";
  }

  const priceNotStarted = (data.pricing.dateIni.getTime() > ((new Date()).getTime()))
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
    {showSaleText && data.id == 1 && <><Divider />
      <div className={`flex gap-5 mt-[20px] bold !w-full`}>
        INCLUIDO CON TU COMPRA:
      </div>
      <div className={`flex gap-5 mt-[10px] !w-full`}>
        Acceso a la membresía del Campamento DeFi (12 meses de todas las formaciones impartidas en el Campamento)
      </div>
      <div className={`flex gap-5 mt-[20px] !w-full`}>
        NFT con poderes especiales
      </div>
    </>}
    {showSaleText && data.id == 8 && <><Divider />
      <div className={`flex gap-5 mt-[20px] bold !w-full text-[20px]`}>
        El NFT incluye:
      </div>
      <div className={`flex gap-5 mt-[10px] !w-full bold pl-[20px] text-[18px]`}>
        - Descuento en tu subscripción al Baby Scout Otoño o a la Membresía.
      </div>
      <div className={` flex gap-5 !w-full pl-[20px]`}>
        El descuento será de 500 USDC si te subscribes antes del 16/09, y luego irá bajando cada minuto hasta el 20/09, cuando ya no habrá descuento.
      </div>
      <div className={` flex gap-5 mt-[15px] !w-full bold pl-[20px] text-[18px]`}>
        - Airdrop del token mIndex, que te daremos por el mismo valor en USDC que estás comprando tu NFT.
      </div>
      <div className={` flex gap-5 mt-[15px] !w-full pl-[20px] text-[18px]`}>
        - Más sorpresas y regalos inesperados que iremos dando
      </div>
      <div className={`flex gap-5 mt-[20px] !w-full text-[16px]`}>
        Recuerda que este NFT valdrá sólo 1 USDC hasta el día 13/09. A partir de esa fecha, subirá progresivamente hasta los 100 USDC el día 16/09.
        Después del 20/09, ya no podrás comprarlo.
      </div>
    </>}
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