import { Skeleton } from '@mui/material';
import { Display } from '@Views/Common/Tooltips/Display';
import { TableAligner } from '@Views/Common/TableAligner';
import { Card } from '../../Common/Card/Card';
import { BadgeContext } from '..';
import { useContext, useEffect, useState } from 'react';
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

const PlanInfoUserNotSubscribed = ({ data }: { data: any }) => {

  //console.log("Enabled:"); console.log(enabledStr);
  //console.log("data.pricing", data.pricing);
  return (
    <>
      <TableAligner
        keysName={[t('badge.Duration'), t('badge.Subscription Price'), t('badge.Status'), t('badge.Time left to subscribe')]}
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
            {
              (data.pricing.subscriptionPublicPrice.amount > data.pricing.subscriptionPrice.amount) && <span className='line-through mr-5'><Display
                className="!justify-end"
                data={data.pricing.subscriptionPublicPrice.amount}
                precision={2}
              />
              </span>
            }
            {data.pricing.subscriptionPrice.amount > 0 && <Display
              className="!justify-end"
              data={data.pricing.subscriptionPrice.amount}
              unit={data.pricing.subscriptionPrice.token}
              precision={2}
            />}
            {data.pricing.subscriptionPrice.amount <= 0 && <Display
              className="!justify-end"
              data={t("badge.Not available")}
            />}
          </div>,
          <div className={`${wrapperClasses}`}>
            {<Display
              className="!justify-end"
              data={t("badge.Not subscribed")}
            />}
          </div>,
          <div className={`${wrapperClasses}`}>
            <Countdown date={data.pricing.dateEnd} />
          </div>,
        ]}
        keyStyle={keyClasses}
        valueStyle={valueClasses}
      />
    </>
  );
};

const Countdown = ({ date }: { date: Date }) => {

  const dateLiterals = { d: t("airdrop.Days"), h: t("airdrop.Hours"), m: t("airdrop.Minutes"), s: t("airdrop.Seconds") };
  const [counter, setCounter] = useState("");
  useEffect(() => {
    setTimeout(() => setCounter(secsToDiffDate(dateDiffInSecs(new Date(Date.now()), date), dateLiterals, t("airdrop.Sales ended!"))), 1000);
  }, [counter]);

  return (
    <div>{counter}</div>
  );
}

function dateDiffInSecs(a: Date, b: Date) {
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((b.getTime() - a.getTime()) / 1000);
}

function secsToDiffDate(secs: number, dateLiterals: any, endedLiteral: string) {
  if (secs <= 0) {
    return endedLiteral;
  }
  let days = 0, hours = 0, minutes = 0;
  const DAY_IN_SECS = 60 * 60 * 24;
  const HOUR_IN_SECS = 60 * 60;
  const MIN_IN_SECS = 60;

  if (secs > DAY_IN_SECS) {
    days = Math.floor(secs / DAY_IN_SECS);
    secs -= days * DAY_IN_SECS;
  }

  if (secs > HOUR_IN_SECS) {
    hours = Math.floor(secs / HOUR_IN_SECS);
    secs -= hours * HOUR_IN_SECS;
  }

  if (secs > MIN_IN_SECS) {
    minutes = Math.floor(secs / MIN_IN_SECS);
    secs -= minutes * MIN_IN_SECS;
  }

  let countDownLiterl = '';
  if (days > 0)
    countDownLiterl += `${days} ${dateLiterals.d} `;

  if (hours > 0 || days > 0)
    countDownLiterl += `${hours} ${dateLiterals.h} `;

  if (minutes > 0 || hours > 0 || days > 0)
    countDownLiterl += `${minutes} ${dateLiterals.m} `;

  return `${countDownLiterl} ${secs} ${dateLiterals.s}`;
}

const PlanInfoUser = ({ data }: { data: any }) => {

  if (data.userBalance == 0) {
    return <PlanInfoUserNotSubscribed data={data} />
  }

  return (
    <>
      <TableAligner
        keysName={[t('badge.Status'), t('badge.Time left'), t('badge.Renewal Price')]}
        values={[
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={t("badge.Subscribed")}
            />
          </div>,
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={`${data.tokenIdAttributes.remainingDays} days`}
            />
          </div>,
          data.pricing.renewalPrice.amount > 0 ? <div className={`${wrapperClasses}`}>
            {
              (data.pricing.renewalPublicPrice.amount > data.pricing.renewalPrice.amount) && <span className='line-through mr-5'><Display
                className="!justify-end"
                data={data.pricing.renewalPublicPrice.amount}
                precision={2}
              />
              </span>
            }
            <Display
              className="!justify-end"
              data={data.pricing.renewalPrice.amount}
              unit={data.pricing.renewalPrice.token}
              precision={2}
            />
          </div>
            : <div className={`${wrapperClasses}`}>
              <Display
                className="!justify-end"
                data={"-"}
              />
            </div>
        ]}
        keyStyle={keyClasses}
        valueStyle={valueClasses}
      />
    </>
  );
};