import { Skeleton } from '@mui/material';
import { Display } from '@Views/Common/Tooltips/Display';
import { TableAligner } from '@Views/Common/TableAligner';
import { IMuchoAirdropManagerData } from '../AirdropAtom';
import { Card } from '../../Common/Card/Card';
//import { BADGE_CONFIG } from '../Config/Plans';
import { ViewContext } from '..';
import { useContext, useEffect, useState } from 'react';
import { AirdropButtons } from './MuchoAirdropButtons';
import { BufferProgressBar } from '@Views/Common/BufferProgressBar.tsx';
import { Chain } from 'wagmi';

export const keyClasses = '!text-f15 !text-2 !text-left !py-[6px] !pl-[0px]';
export const valueClasses = '!text-f15 text-1 !text-right !py-[6px] !pr-[0px]';
export const tooltipKeyClasses = '!text-f14 !text-2 !text-left !py-1 !pl-[0px]';
export const tooltipValueClasses =
  '!text-f14 text-1 !text-right !py-1 !pr-[0px]';
export const underLineClass =
  'underline underline-offset-4 decoration decoration-[#ffffff30]  w-fit ml-auto';


export const wrapperClasses = 'flex justify-end flex-wrap';



export const getMuchoAirdropCards = (data: IMuchoAirdropManagerData) => {
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
  const viewContextValue = useContext(ViewContext);
  if (viewContextValue) {
    activeChain = viewContextValue.activeChain;
  }


  const farmsInfo = [<MuchoAirdropCard data={data} />];

  return farmsInfo;
};


const MuchoAirdropCard = ({ data }: { data: IMuchoAirdropManagerData }) => {
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
          <span className={underLineClass}>mAirdrop Token</span>
          <div className="text-f12 text-3  mt-2">
            Available:&nbsp;&nbsp;&nbsp;&nbsp;
            <Display
              data={data.mAirdropMaxSupply - data.mAirdropCurrentSupply}
              className="inline"
              disable
              precision={0}
            />
            &nbsp;
            / &nbsp;
            <Display
              data={data.mAirdropMaxSupply}
              unit={"mAirdrop"}
              className="inline"
              disable
              precision={0}
            />
          </div>
          <div className="max-w-[300px]">
            <BufferProgressBar
              fontSize={12}
              progressPercent={100 - Number(100 * data.mAirdropCurrentSupply / data.mAirdropMaxSupply)}
            />
          </div>
        </>
      }
      middle={<>
        <MuchoAirdropInfo data={data} />
      </>}
      bottom={
        <div className="mt-5 !text-right">
          <AirdropButtons data={data} />
        </div>
      }
    />
  );
}

const MuchoAirdropInfo = ({ data }: { data: IMuchoAirdropManagerData }) => {

  return (
    <>
      <TableAligner
        keysName={
          ['Your mAirdrop in wallet', 'Price', 'Final date to buy', 'Time left to buy']
        }
        values={[
          <div className={`${wrapperClasses}`}>

            <Display
              className="!justify-end"
              data={data.mAirdropInWallet}
              unit={"mAirdrop"}
              precision={2}
            />
          </div>,
          <div className={`${wrapperClasses}`}>

            <Display
              className="!justify-end"
              data={data.price}
              unit={data.priceTokenSymbol}
              precision={0}
            />
          </div>,
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={data.dateEnd.toISOString().split('T')[0]}
            />

          </div>
          ,
          <div className={`${wrapperClasses}`}>
            <Countdown date={data.dateEnd} />

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

  const [counter, setCounter] = useState("");
  useEffect(() => {
    setTimeout(() => setCounter(secsToDiffDate(dateDiffInSecs(new Date(Date.now()), date))), 1000);
  }, [counter]);



  return (
    <div>
      <div>{counter}</div>
    </div>
  );
}


function dateDiffInSecs(a: Date, b: Date) {
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((b.getTime() - a.getTime()) / 1000);
}

function secsToDiffDate(secs: number) {
  if (secs <= 0) {
    return "Sales ended!"
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

  return `${days} Days ${hours} Hours ${minutes} Minutes ${secs} Seconds`;
}