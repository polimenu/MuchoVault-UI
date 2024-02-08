import { Skeleton } from '@mui/material';
import { Display } from '@Views/Common/Tooltips/Display';
import { TableAligner } from '@Views/Common/TableAligner';
import { IMuchoIndexDataPrice, IMuchoTokenLauncherData, IOldLaunchesData } from '../IndexAtom';
import { Card } from '../../Common/Card/Card';
//import { BADGE_CONFIG } from '../Config/Plans';
import { ViewContext } from '..';
import { useContext, useEffect, useState } from 'react';
import { IndexButtons } from './MuchoIndexButtons';
import { BufferProgressBar } from '@Views/Common/BufferProgressBar.tsx';
import { Chain } from 'wagmi';
import { t } from 'i18next';
import { MINDEX_CONFIG } from '../Config/mIndexConfig';

export const keyClasses = '!text-f15 !text-2 !text-left !py-[6px] !pl-[0px]';
export const valueClasses = '!text-f15 text-1 !text-right !py-[6px] !pr-[0px]';
export const tooltipKeyClasses = '!text-f14 !text-2 !text-left !py-1 !pl-[0px]';
export const tooltipValueClasses =
  '!text-f14 text-1 !text-right !py-1 !pr-[0px]';
export const underLineClass =
  'underline underline-offset-4 decoration decoration-[#ffffff30]  w-fit ml-auto';


export const wrapperClasses = 'flex justify-end flex-wrap';



export const getMuchoIndexCards = (data: IMuchoTokenLauncherData) => {
  const viewContextValue = useContext(ViewContext);
  //console.log("getBadgeCards 0");
  //console.log("getV2AdminCards data", data);

  if (!data) {
    //console.log("getBadgeCards 1");
    return [0, 1, 2, 3].map((index) => (
      <Skeleton
        key={index}
        variant="rectangular"
        className="w-full !h-full min-h-[370px] !transform-none !bg-1"
      />
    ));
  }

  //console.log("Drawing cards with data", data);

  let activeChain: Chain | null = null;
  if (viewContextValue) {
    activeChain = viewContextValue.activeChain;
  }


  const farmsInfo = [<MuchoIndexCard data={data} />];

  return farmsInfo;
};


const MuchoIndexCard = ({ data }: { data: IMuchoTokenLauncherData }) => {
  if (!data) {
    return <Skeleton
      key={0}
      variant="rectangular"
      className="w-full !h-full min-h-[370px] !transform-none !bg-1"
    />
  }

  return (
    <Card
      top={
        <>
          <span className={underLineClass}>{t("index.Current mIndex Token Sale")} {data.mTokenVersion ? `(v${data.mTokenVersion})` : ''}</span>
        </>
      }
      middle={<>
        {<MuchoIndexInfo data={data} />}
      </>}
      bottom={
        <div className="mt-5 !text-right">
          <IndexButtons data={data} />
        </div>
      }
    />
  );
}

const PricesDisplay = ({ prices }: { prices: IMuchoIndexDataPrice[] }) => {
  let priceFields = []
  let anyPrice = false;

  for (let i = 0; i < prices.length; i++) {
    if (i == 0 || prices[i].price != prices[i - 1].price) {

      anyPrice = anyPrice || Boolean(prices[i].price);

      priceFields.push(<Display
        key={`price_${i}`}
        className="!justify-end"
        data={prices[i].price}
        unit={prices[i].priceTokenSymbol}
        precision={6}
      />);
    }
    else {
      priceFields.push(<span key={`price_${i}`}>{prices[i].priceTokenSymbol}</span>);
    }

    if (i < prices.length - 1) {
      priceFields.push(<span key={`price__${i}`}>&nbsp;&nbsp;/&nbsp;&nbsp;</span>)
    }
  }

  return <div className={`${wrapperClasses}`}>{anyPrice ? priceFields : "?"}</div>;
  /*
    return {prices.map((p, i, a) => <>
      {(i == 0 || p.price !== a[i - 1].price) ? (
    {i < prices.length - 1 && <>&nbsp;&nbsp;/&nbsp;&nbsp;</>})
      :
    p.priceTokenSymbol}
  
    </>)};*/
}

const MuchoIndexInfo = ({ data }: { data: IMuchoTokenLauncherData }) => {
  const started = data.dateIni <= new Date();

  return (
    <>
      <TableAligner
        keysName={
          [t('index.Your mIndex in wallet'),
          t('index.Price'),
          t('index.Start date'),
          t('index.Final date to buy'),
          started ? t('index.Time left to buy') : t('index.Will start in')
          ]
        }
        values={[
          <div className={`${wrapperClasses}`}>

            <Display
              className="!justify-end"
              data={data.userBalance}
              unit={"mIndex"}
              precision={4}
            />
          </div>,
          <PricesDisplay prices={data.prices} />
          ,
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={data.dateIni.toISOString().split('T')[0]}
            />

          </div>
          ,
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={data.dateEnd.toISOString().split('T')[0]}
            />

          </div>
          ,
          <div className={`${wrapperClasses}`}>
            <Countdown date={started ? data.dateEnd : data.dateIni} />

          </div>
        ]
        }
        keyStyle={keyClasses}
        valueStyle={valueClasses}
      />
    </>
  );
};

const Countdown = ({ date }: { date: Date }) => {

  const dateLiterals = { d: t("index.Days"), h: t("index.Hours"), m: t("index.Minutes"), s: t("index.Seconds") };
  const [counter, setCounter] = useState("");
  useEffect(() => {
    setTimeout(() => setCounter(secsToDiffDate(dateDiffInSecs(new Date(Date.now()), date), dateLiterals, t("index.Sales ended!"))), 1000);
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