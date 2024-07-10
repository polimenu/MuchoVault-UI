import { Skeleton } from '@mui/material';
import { Display } from '@Views/Common/Tooltips/Display';
import { TableAligner } from '@Views/Common/TableAligner';
import { Card } from '../../Common/Card/Card';
import { BadgeContext } from '..';
import { useContext } from 'react';
import { t } from 'i18next';
import { SalePlanButtons } from './SalePlanButtons';
export const keyClasses = '!text-f15 !text-2 !text-left !py-[6px] !pl-[0px]';
export const valueClasses = '!text-f15 text-1 !text-right !py-[6px] !pr-[0px]';
export const tooltipKeyClasses = '!text-f14 !text-2 !text-left !py-1 !pl-[0px]';
export const tooltipValueClasses =
  '!text-f14 text-1 !text-right !py-1 !pr-[0px]';
export const underLineClass =
  'underline underline-offset-4 decoration decoration-[#ffffff30]  w-fit ml-auto';


export const wrapperClasses = 'flex justify-end flex-wrap';

export const SalePlanCard = ({ data }: { data: any }) => {
  //console.log("getBadgeCards 0");
  if (!data || (data.userBalance > 0 && !data.tokenIdAttributes)) {
    //console.log("getBadgeCards 1");
    return <Skeleton
      key={"sk"}
      variant="rectangular"
      className="w-full !h-full min-h-[370px] !transform-none !bg-1"
    />;
  }
  //console.log("getBadgeCards");
  //console.log(data);
  let activeChain: Chain | null = null;
  const badgeContextValue = useContext(BadgeContext);
  if (badgeContextValue) {
    activeChain = badgeContextValue.activeChain;
  }

  return <PlanCard data={data} key="SalePlanCard" />;

};



const PlanCard = ({ data }: { data: any }) => {
  //console.log("PlanCard");
  return (
    <Card
      top={
        <>
          <span className={underLineClass}>{data.planAttributes.planName}</span>
        </>
      }
      middle={
        <>
          {<PlanInfoUser data={data} />}
        </>
      }
      bottom={
        < div className="mt-5" >
          {<SalePlanButtons data={data} />}
        </div >
      }
    />
  );
}



const PlanInfoUser = ({ data }: { data: any }) => {
  //console.log("CARD Plan:", plan);
  const enabledStr: string = data.userBalance > 0 ? t("badge.Subscribed") + ` (${data.tokenIdAttributes.remainingDays} days) [Id=${data.tokenIdAttributes.tokenId}]` : t("badge.Not subscribed");

  //console.log("Enabled:"); console.log(enabledStr);
  return (
    <>
      <TableAligner
        keysName={[t('badge.Duration'), t('badge.Subscription Price'), t('badge.Status (time left)')]}
        values={[
          <div className={`${wrapperClasses}`}>

            <Display
              className="!justify-end"
              data={data.planAttributes.duration}
              unit={t("badge.days")}
              precision={0}
            />
          </div>,
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={data.pricing.subscriptionPrice.amount}
              unit={data.pricing.subscriptionPrice.token}
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