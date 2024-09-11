import { Skeleton } from '@mui/material';
import { Display } from '@Views/Common/Tooltips/Display';
import { TableAligner } from '@Views/Common/TableAligner';
import { Card } from '../../Common/Card/Card';
import { BadgeContext } from '..';
import { useContext, useEffect, useState } from 'react';
import { t } from 'i18next';
import { SalePlanButtons } from './SalePlanButtons';
import { IPlanDetailed } from '../badgeAtom';
export const keyClasses = '!text-f15 !text-2 !text-left !py-[6px] !pl-[0px]';
export const valueClasses = '!text-f15 text-1 !text-right !py-[6px] !pr-[0px]';
export const tooltipKeyClasses = '!text-f14 !text-2 !text-left !py-1 !pl-[0px]';
export const tooltipValueClasses =
  '!text-f14 text-1 !text-right !py-1 !pr-[0px]';
export const underLineClass =
  'underline underline-offset-4 decoration decoration-[#ffffff30]  w-fit ml-auto';


export const wrapperClasses = 'flex justify-end flex-wrap';


export const SalePlanCard = ({ data, isSalePage }: { data: IPlanDetailed, isSalePage: boolean }) => {
  if (!data) {
    //console.log("getBadgeCards 1");
    return <Skeleton
      key={"sk"}
      variant="rectangular"
      className="w-full !h-full min-h-[370px] !transform-none !bg-1"
    />;
  }

  let activeChain: Chain | null = null;
  const badgeContextValue = useContext(BadgeContext);
  if (badgeContextValue) {
    activeChain = badgeContextValue.activeChain;
  }

  return <PlanCard data={data} key="SalePlanCard" isSalePage={isSalePage} />;

};



const PlanCard = ({ data, isSalePage }: { data: IPlanDetailed, isSalePage: boolean }) => {
  //console.log("PlanCard");
  return (
    <Card
      top={
        <>
          <span className={underLineClass}>{data && data.planAttributes ? data.planAttributes.planName : "Loading..."}</span>
        </>
      }
      middle={
        <>
          {<PlanInfoUser data={data} />}
        </>
      }
      bottom={
        < div className="mt-5" >
          {<SalePlanButtons data={data} showSaleText={isSalePage} />}
        </div >
      }
    />
  );
}

const PlanInfoUserNotSubscribed = ({ data }: { data: IPlanDetailed }) => {
  const [dateCountDown, setDateCountDown] = useState(<></>);
  const [timeLeftLiteral, setTimeLeftLiteral] = useState("");

  enum PlanStatus {
    NOT_STARTED,
    STARTED,
    ENDED
  }

  const now = new Date();
  const status = data.pricing.dateEnd < now ? PlanStatus.ENDED :
    (data.pricing.dateIni > now ? PlanStatus.NOT_STARTED : PlanStatus.STARTED);
  //console.log("plan status", data.planAttributes.planName, status);

  useEffect(() => {
    //console.log("SETTING COUNTDOWN", data.planAttributes.planName, status, data.pricing.dateIni, data.pricing.dateEnd);

    setDateCountDown((status == PlanStatus.ENDED) ? <>{t("airdrop.Sales ended!")}</> : <Countdown dates={[data.pricing.dateIni, data.pricing.dateEnd]} />);

    setTimeLeftLiteral((status == PlanStatus.NOT_STARTED) ? t('badge.Time left to start') :
      (status == PlanStatus.STARTED ? t('badge.Time left to subscribe') : ""));
  }, [status]);

  //console.log("Enabled:"); console.log(enabledStr);
  //console.log("data.pricing", data.pricing);
  return (
    <>
      <TableAligner
        keysName={[
          t('badge.Duration'),
          t('badge.Subscription Price'),
          t('badge.Status'),
          timeLeftLiteral
        ]}
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
              (data.pricing.publicPrice.amount > data.pricing.userPrice.amount) && <span className='line-through mr-5'><Display
                className="!justify-end"
                data={data.pricing.publicPrice.amount}
                precision={2}
              />
              </span>
            }
            {data.pricing.userPrice.amount > 0 && <Display
              className="!justify-end"
              data={data.pricing.userPrice.amount}
              unit={data.pricing.userPrice.token}
              precision={2}
            />}
            {data.pricing.userPrice.amount <= 0 && <Display
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
            {dateCountDown}
          </div>,
        ]}
        keyStyle={keyClasses}
        valueStyle={valueClasses}
      />
    </>
  );
};

const Countdown = ({ dates }: { dates: Date[] }) => {

  let cdTimeout: NodeJS.Timeout;
  const dateLiterals = { d: t("airdrop.Days"), h: t("airdrop.Hours"), m: t("airdrop.Minutes"), s: t("airdrop.Seconds") };
  const [counter, setCounter] = useState("");
  useEffect(() => {
    for (const date of dates) {
      const diffSecs = dateDiffInSecs(new Date(Date.now()), date);
      if (diffSecs >= 0) {
        cdTimeout = setTimeout(() => setCounter(secsToDiffDate(diffSecs, dateLiterals)), 1000);
        break;
      }
    }
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

function secsToDiffDate(secs: number, dateLiterals: any) {
  if (secs <= 0) {
    return `0 ${dateLiterals.s}`;
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

const PlanInfoUser = ({ data }: { data: IPlanDetailed }) => {

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
          data.renewalPricing.userPrice.amount > 0 ? <div className={`${wrapperClasses}`}>
            {
              (data.renewalPricing.publicPrice.amount > data.renewalPricing.userPrice.amount) && <span className='line-through mr-5'><Display
                className="!justify-end"
                data={data.renewalPricing.publicPrice.amount}
                precision={2}
              />
              </span>
            }
            <Display
              className="!justify-end"
              data={data.renewalPricing.userPrice.amount}
              unit={data.renewalPricing.userPrice.token}
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