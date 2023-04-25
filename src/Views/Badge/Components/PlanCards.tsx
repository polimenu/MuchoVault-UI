import { Skeleton } from '@mui/material';
import { Display } from '@Views/Common/Tooltips/Display';
import { TableAligner } from '@Views/Common/TableAligner';
import { IBadge, IPlan } from '../badgeAtom';
import { Card } from './Card';
import { Divider } from './Divider';
import { PlanButtons } from './PlanButtons';
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

export const getPlanCards = (data: IBadge) => {
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
    return <PlanCard plan={p} />
  });

  return planCards;
};



const PlanCard = ({ plan }: { plan: IPlan }) => {
  //console.log("PlanCard");
  return (
    <Card
      top={
        <>
          <span className={underLineClass}>[{plan.id}] {plan.name}</span>
        </>
      }
      middle={<PlanInfo plan={plan} />}
      bottom={
        <div className="mt-5">
          <PlanButtons plan={plan} />
        </div>
      }
    />
  );
}

const PlanInfo = ({ plan }: { plan: IPlan }) => {

  return (
    <>
      <TableAligner
        keysName={['Duration', 'Subscription Price', 'Renewal Price', 'Status', 'Subscribers']}
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
              data={plan.enabled ? "Enabled" : "Disabled"}
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