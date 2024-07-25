import { Skeleton } from '@mui/material';
import { Display } from '@Views/Common/Tooltips/Display';
import { TableAligner } from '@Views/Common/TableAligner';
import { IBadge, IPlan, badgeAtom } from '../badgeAtom';
import { Card } from '../../Common/Card/Card';
import { PlanAdminButtons, PlanButtons } from './PlanButtons';
//import { BADGE_CONFIG } from '../Config/Plans';
import { BadgeContext } from '..';
import { useContext } from 'react';
import { t } from 'i18next';
import { useAtom } from 'jotai';
import { Divider } from '@Views/Common/Card/Divider';
import { dateFormat } from '@Views/Common/Utils';
import { VALID_TOKENS } from '../Config/BadgeConfig';
import { IPricing } from '../badgeAtom';
export const keyClasses = '!text-f15 !text-2 !text-left !py-[6px] !pl-[0px]';
export const valueClasses = '!text-f15 text-1 !text-right !py-[6px] !pr-[0px]';
export const tooltipKeyClasses = '!text-f14 !text-2 !text-left !py-1 !pl-[0px]';
export const tooltipValueClasses =
  '!text-f14 text-1 !text-right !py-1 !pr-[0px]';
export const underLineClass =
  'underline underline-offset-4 decoration decoration-[#ffffff30]  w-fit ml-auto';


export const wrapperClasses = 'flex justify-end flex-wrap';

export const getPlanCards = (data: IBadge, admin: boolean) => {
  //console.log("getBadgeCards 0");
  if (!data?.plans) {
    //console.log("getBadgeCards 1");
    return [0, 1, 2, 3].map((index) => (
      <Skeleton
        key={index}
        variant="rectangular"
        className="w-full !h-full min-h-[370px] !transform-none !bg-1"
      />
    ));
  }
  //console.log("getBadgeCards");
  //console.log(data);
  let activeChain: Chain | null = null;
  const badgeContextValue = useContext(BadgeContext);
  if (badgeContextValue) {
    activeChain = badgeContextValue.activeChain;
  }

  const planCards = data.plans.map((p, i) => {
    return <PlanCard plan={p} admin={admin} />
  });

  return planCards;
};



const PlanCard = ({ plan, admin }: { plan: IPlan, admin: boolean }) => {
  const [state, setPageState] = useAtom(badgeAtom);
  //console.log("PlanCard");
  return (
    <Card
      top={
        <>
          <span className={underLineClass + " pointer"} onClick={() => {
            setPageState({ ...state, activeModal: { plan: plan, action: "editName" }, isModalOpen: true })
          }}>{admin && "[" + plan.id + "] "}{plan.name}</span>
        </>
      }
      middle={
        <>
          {admin && <PlanInfoAdmin plan={plan} />}
          {!admin && <PlanInfoUser plan={plan} />}
        </>
      }
      bottom={admin && <div className="mt-5" >
        <PlanAdminButtons plan={plan} />
      </div >
      }
    />
  );
}

const PlanInfoAdmin = ({ plan }: { plan: IPlan }) => {
  const [state, setPageState] = useAtom(badgeAtom);
  //console.log("Plan:", plan);
  //console.log("Enabled:", enabledStr);

  return (
    <>
      <TableAligner
        keysName={['Duration']}
        values={[
          <div className={`${wrapperClasses} underline pointer`} onClick={() => {
            setPageState({ ...state, activeModal: { plan: plan, action: "editDuration" }, isModalOpen: true })
          }}>
            <Display
              className="!justify-end"
              data={plan.time}
              unit={"days"}
              precision={0}
            />
          </div>
        ]}
        keyStyle={keyClasses}
        valueStyle={valueClasses}
      />
      <Divider />
      <PricingTable head="Subscription Parameters" pricing={plan.subscriptionPricing} />
      <Divider />
      <PricingTable head="Renewal Parameters" pricing={plan.renewalPricing} />
      <Divider />
      <TableAligner
        keysName={['Status', 'Holders']}
        values={[

          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={plan.status}
            />
          </div>,
          <>
            <div className={`${wrapperClasses}`}>
              <Display
                className="!justify-end"
                data={plan.subscribers}
                precision={0}
              />
            </div>
          </>,
        ]}
        keyStyle={keyClasses}
        valueStyle={valueClasses}
      />
    </>
  );
};


const PricingTable = ({ head, pricing }: { head: string, pricing: IPricing }) => {
  const [state, setPageState] = useAtom(badgeAtom);

  return <TableAligner
    keysName={[<b>{head}</b>,
      'Buy Token', 'Price Rise Init Value', 'Price Rise End Value',
      'Init Buyable Date', 'End Buyable Date',
      'Price Rise Init Date', 'Price Rise End Date',
    ]}
    values={[
      <div className={`${wrapperClasses}`}></div>,

      <div className={`${wrapperClasses} underline pointer`} onClick={() => {
        setPageState({ ...state, activeModal: { pricing, action: "editToken" }, isModalOpen: true })
      }}>
        <Display
          className="!justify-end"
          data={VALID_TOKENS[pricing.token].symbol}
        />
      </div>,
      <div className={`${wrapperClasses} underline pointer`} onClick={() => {
        setPageState({ ...state, activeModal: { pricing, priceType: "Init", action: "editPricingPrice" }, isModalOpen: true })
      }}>
        <Display
          className="!justify-end"
          data={(pricing.priceRampIni)}
        />
      </div>,
      <div className={`${wrapperClasses} underline pointer`} onClick={() => {
        setPageState({ ...state, activeModal: { pricing, priceType: "End", action: "editPricingPrice" }, isModalOpen: true })
      }}>
        <Display
          className="!justify-end"
          data={(pricing.priceRampEnd)}
        />
      </div>,

      <div className={`${wrapperClasses} underline pointer`} onClick={() => {
        setPageState({ ...state, activeModal: { pricing, dateType: "Ini", action: "editPricingDate" }, isModalOpen: true })
      }}>
        <Display
          className="!justify-end"
          data={dateFormat(pricing.dateIni)}
        />
      </div>,
      <div className={`${wrapperClasses} underline pointer`} onClick={() => {
        setPageState({ ...state, activeModal: { pricing, dateType: "End", action: "editPricingDate" }, isModalOpen: true })
      }}>
        <Display
          className="!justify-end"
          data={dateFormat(pricing.dateEnd)}
        />
      </div>,


      <div className={`${wrapperClasses} underline pointer`} onClick={() => {
        setPageState({ ...state, activeModal: { pricing, dateType: "RampIni", action: "editPricingDate" }, isModalOpen: true })
      }}>
        <Display
          className="!justify-end"
          data={dateFormat(pricing.dateRampIni)}
        />
      </div>,
      <div className={`${wrapperClasses} underline pointer`} onClick={() => {
        setPageState({ ...state, activeModal: { pricing, dateType: "RampEnd", action: "editPricingDate" }, isModalOpen: true })
      }}>
        <Display
          className="!justify-end"
          data={dateFormat(pricing.dateRampEnd)}
        />
      </div>,


    ]}
    keyStyle={keyClasses}
    valueStyle={valueClasses}
  />
}

const PlanInfoUser = ({ plan }: { plan: IPlan }) => {
  //console.log("Plan:"); console.log(plan);
  const enabledStr: string = plan.isActiveForCurrentUser ? t("badge.Subscribed") :
    (plan.isExpiredForCurrentUser ? t("badge.Expired") : t("badge.Not subscribed"));

  //console.log("Enabled:"); console.log(enabledStr);
  return (
    <>
      <TableAligner
        keysName={[t('badge.Duration'), t('badge.Subscription Price'), t('badge.Renewal Price'), t('badge.Status (time left)')]}
        values={[
          <div className={`${wrapperClasses}`}>

            <Display
              className="!justify-end"
              data={plan.time}
              unit={t("badge.days")}
              precision={0}
            />
          </div>,
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={plan.subscriptionPrice.amount > 0 ? plan.subscriptionPrice.amount : "-"}
              unit={plan.subscriptionPrice.amount > 0 ? plan.subscriptionPrice.token : ""}
              precision={2}
            />
          </div>,
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={plan.renewalPrice.amount > 0 ? plan.renewalPrice.amount : "-"}
              unit={plan.renewalPrice.amount > 0 ? plan.renewalPrice.token : ""}
              precision={2}
            />
          </div>,
          <div className={`${wrapperClasses}`}>
            {<Display
              className="!justify-end"
              data={enabledStr}
            />}
          </div>,
        ]}
        keyStyle={keyClasses}
        valueStyle={valueClasses}
      />
    </>
  );
};