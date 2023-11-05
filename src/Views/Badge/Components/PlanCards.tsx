import { Skeleton } from '@mui/material';
import { Display } from '@Views/Common/Tooltips/Display';
import { TableAligner } from '@Views/Common/TableAligner';
import { IBadge, IPlan } from '../badgeAtom';
import { Card } from '../../Common/Card/Card';
import { PlanAdminButtons, PlanButtons } from './PlanButtons';
//import { BADGE_CONFIG } from '../Config/Plans';
import { BadgeContext } from '..';
import { useContext } from 'react';
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
  //console.log("PlanCard");
  return (
    <Card
      top={
        <>
          <span className={underLineClass}>{admin && "[" + plan.id + "] "}{plan.name}</span>
        </>
      }
      middle={
        <>
          {admin && <PlanInfoAdmin plan={plan} />}
          {!admin && <PlanInfoUser plan={plan} />}
        </>
      }
      bottom={
        < div className="mt-5" >
          {admin && <PlanAdminButtons plan={plan} />}
          {!admin && <PlanButtons plan={plan} />}
        </div >
      }
    />
  );
}

const PlanInfoAdmin = ({ plan }: { plan: IPlan }) => {
  //console.log("Plan:", plan);
  const enabledStr = plan.enabled ? "Enabled" : "Disabled";
  //console.log("Enabled:", enabledStr);
  return (
    <>
      <TableAligner
        keysName={['Duration', 'Subscription Price', 'Renewal Price', 'Status', 'Subscribers (active)']}
        values={[
          <div className={`${wrapperClasses}`}>

            <Display
              className="!justify-end"
              data={plan.time}
              unit={"days"}
              precision={0}
            />
          </div>,
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={plan.subscriptionPrice.amount}
              unit={plan.subscriptionPrice.token}
              precision={2}
            />
          </div>,
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={plan.renewalPrice.amount}
              unit={plan.renewalPrice.token}
              precision={2}
            />
          </div>,
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
              &nbsp;(
              <Display
                className="!justify-end"
                data={plan.activeSubscribers}
                precision={0}
              />
              )
            </div>
          </>,
        ]}
        keyStyle={keyClasses}
        valueStyle={valueClasses}
      />
    </>
  );
};



const PlanInfoUser = ({ plan }: { plan: IPlan }) => {
  //console.log("Plan:"); console.log(plan);
  const enabledStr: string = plan.isActiveForCurrentUser ? "Subscribed" :
    (plan.isExpiredForCurrentUser ? "Expired" : "Not subscribed");

  //console.log("Enabled:"); console.log(enabledStr);
  return (
    <>
      <TableAligner
        keysName={['Duration', 'Subscription Price', 'Renewal Price', 'Status (time left)']}
        values={[
          <div className={`${wrapperClasses}`}>

            <Display
              className="!justify-end"
              data={plan.time}
              unit={"days"}
              precision={0}
            />
          </div>,
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={plan.subscriptionPrice.amount}
              unit={plan.subscriptionPrice.token}
              precision={2}
            />
          </div>,
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={plan.renewalPrice.amount}
              unit={plan.renewalPrice.token}
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