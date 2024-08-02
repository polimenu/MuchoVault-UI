import { Skeleton } from '@mui/material';
import { Display } from '@Views/Common/Tooltips/Display';
import { TableAligner } from '@Views/Common/TableAligner';
import { IPlanDetailed, IPlanPricingData, badgeAtom } from '../badgeAtom';
import { Card } from '../../Common/Card/Card';
import { AdminPlanButtons } from './AdminPlanButtons';
import { useAtom } from 'jotai';
import { Divider } from '@Views/Common/Card/Divider';
import { dateFormat } from '@Views/Common/Utils';
import { VALID_TOKENS } from '../Config/BadgeConfig';
export const keyClasses = '!text-f15 !text-2 !text-left !py-[6px] !pl-[0px]';
export const valueClasses = '!text-f15 text-1 !text-right !py-[6px] !pr-[0px]';
export const tooltipKeyClasses = '!text-f14 !text-2 !text-left !py-1 !pl-[0px]';
export const tooltipValueClasses =
  '!text-f14 text-1 !text-right !py-1 !pr-[0px]';
export const underLineClass =
  'underline underline-offset-4 decoration decoration-[#ffffff30]  w-fit ml-auto';


export const wrapperClasses = 'flex justify-end flex-wrap';

const planReadyToDraw = (plan: IPlanDetailed) => {
  return Boolean(plan && plan.planAttributes && plan.pricing && plan.tokenIdAttributes)
}

export const AdminPlanCard = ({ plan }: { plan: IPlanDetailed }) => {
  const [state, setPageState] = useAtom(badgeAtom);

  if (!planReadyToDraw(plan)) {
    //console.log("getBadgeCards 1");
    return <Skeleton
      key={"sk_" + plan.id.toString()}
      variant="rectangular"
      className="w-full !h-full min-h-[370px] !transform-none !bg-1"
    />;
  }

  //console.log("PlanCard");
  return (
    <Card
      top={
        <>
          <span className={underLineClass + " pointer"} onClick={() => {
            setPageState({ ...state, activeModal: { plan: plan, action: "editName" }, isModalOpen: true })
          }}>{"[" + plan.id + "] "}{plan.planAttributes.planName}</span>
        </>
      }
      middle={
        <>
          <PlanInfoAdmin plan={plan} />
        </>
      }
      bottom={<div className="mt-5" >
        <AdminPlanButtons plan={plan} />
      </div>
      }
    />
  );
}

const PlanInfoAdmin = ({ plan }: { plan: IPlanDetailed }) => {
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
              data={plan.planAttributes.duration}
              unit={"days"}
              precision={0}
            />
          </div>
        ]}
        keyStyle={keyClasses}
        valueStyle={valueClasses}
      />
      <Divider />
      <PricingTable head="Subscription Parameters" pricing={plan.pricing} />
      <Divider />
      <PricingTable head="Renewal Parameters" pricing={plan.renewalPricing} />
      <Divider />
      <TableAligner
        keysName={['Status', 'Holders']}
        values={[

          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={plan.planAttributes.enabled ? "Enabled" : "Disabled"}
            />
          </div>,
          <>
            <div className={`${wrapperClasses}`}>
              <Display
                className="!justify-end"
                data={plan.planAttributes.supply}
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


const PricingTable = ({ head, pricing }: { head: string, pricing: IPlanPricingData }) => {
  const [state, setPageState] = useAtom(badgeAtom);
  const token = VALID_TOKENS[pricing.userPrice.contract];

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
          data={token.symbol}
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
