import { Skeleton } from '@mui/material';
import { Display } from '@Views/Common/Tooltips/Display';
import { TableAligner } from '@Views/Common/TableAligner';
import { IMuchoIndexMarketComposition, IMuchoTokenMarketData } from '../IndexAtom';
import { Card } from '../../Common/Card/Card';
//import { BADGE_CONFIG } from '../Config/Plans';
import { ViewContext } from '..';
import { useContext } from 'react';
import { Chain } from 'wagmi';
import { t } from 'i18next';
import { IndexMarketButtons } from './MuchoIndexMarketButtons';

export const keyClasses = '!text-f15 !text-2 !text-left !py-[6px] !pl-[0px]';
export const valueClasses = '!text-f15 text-1 !text-right !py-[6px] !pr-[0px]';
export const tooltipKeyClasses = '!text-f14 !text-2 !text-left !py-1 !pl-[0px]';
export const tooltipValueClasses =
  '!text-f14 text-1 !text-right !py-1 !pr-[0px]';
export const underLineClass =
  'underline underline-offset-4 decoration decoration-[#ffffff30]  w-fit ml-auto';


export const wrapperClasses = 'flex justify-end flex-wrap';


export const getMuchoIndexMarketCards = (data: IMuchoTokenMarketData) => {
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


  return [<MuchoIndexMarketCard data={data} />, <MuchoIndexComposition data={data.indexComposition} />];
}

const MuchoIndexComposition = ({ data }: { data: IMuchoIndexMarketComposition[] }) => {
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
          <span className={underLineClass}>{t("index.mIndex composition")}</span>
        </>
      }
      middle={<>
        {<TableAligner
          keysName={
            data.map(a => a.asset)
          }
          values={data.map(a => <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={a.percentage}
              unit="%"
              precision={1}
            />
          </div>)
          }
          keyStyle={keyClasses}
          valueStyle={valueClasses}
        />}
      </>}
    />
  );
}


const MuchoIndexMarketCard = ({ data }: { data: IMuchoTokenMarketData }) => {

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
          <span className={underLineClass}>{t("index.(mucho) Index")}</span>
          <div className="text-f12 text-3  mt-2">
            {t("index.Total supply")}:&nbsp;&nbsp;&nbsp;&nbsp;
            <Display
              data={data.mTokenCurrentSupply}
              className="inline"
              disable
              precision={0}
            />
          </div>
        </>
      }
      middle={<>
        {<MuchoIndexMarketInfo data={data} />}
      </>}
      bottom={
        <div className="mt-5 !text-right">
          <IndexMarketButtons data={data} />
        </div>
      }
    />
  );
}


const MuchoIndexMarketInfo = ({ data }: { data: IMuchoTokenMarketData }) => {
  return (
    <>
      <TableAligner
        keysName={
          [
            t('index.Your mIndex in wallet'),
            t('index.Price'),
            t('index.Initial Price'),
            t('index.APR'),
            t('index.Buy Price'),
            t('index.Sell Price'),
            t('index.Deposit fee'),
            t('index.Withdraw fee'),
            t('index.Slippage'),
          ]
        }
        values={[
          <div className={`${wrapperClasses}`}>

            <Display
              className="!justify-end"
              data={data.userBalance}
              unit={"mIndex"}
              precision={2}
            />&nbsp;&nbsp;&nbsp;&nbsp;(<Display
              className="!justify-end"
              data={data.userBalance * data.price.priceUSD}
              unit={"$"}
              precision={2}
            />)
          </div>,
          <div className={`${wrapperClasses}`}>

            <Display
              className="!justify-end"
              data={data.price.priceUSD}
              unit={"$"}
              precision={4}
            />
          </div>,
          <div className={`${wrapperClasses}`}>

            <Display
              className="!justify-end"
              data={data.initPriceUSD}
              unit={"$"}
              precision={4}
            />
          </div>,
          <div className={`${wrapperClasses}`}>

            <Display
              className="!justify-end"
              data={100 * (data.price.priceUSD - data.initPriceUSD) * 31536000 / ((new Date()).getTime() / 1000 - data.initTs)}
              unit={"%"}
              precision={2}
            />
          </div>
          ,
          <div className={`${wrapperClasses}`}>

            <Display
              className="!justify-end"
              data={data.price.buyTokenPrice}
              unit={data.price.buyTokenSymbol}
              precision={4}
            />
          </div>
          ,
          <div className={`${wrapperClasses}`}>

            <Display
              className="!justify-end"
              data={data.price.sellTokenPrice}
              unit={data.price.sellTokenSymbol}
              precision={4}
            />
          </div>
          ,
          <div className={`${wrapperClasses}`}>

            <Display
              className="!justify-end"
              data={100 * data.depositFeeUser}
              unit={"%"}
              precision={2}
            />
          </div>
          ,
          <div className={`${wrapperClasses}`}>

            <Display
              className="!justify-end"
              data={100 * data.withdrawFeeUser}
              unit={"%"}
              precision={2}
            />
          </div>
          ,
          <div className={`${wrapperClasses}`}>

            <Display
              className="!justify-end"
              data={100 * data.price.slippage}
              unit={"%"}
              precision={2}
            />
          </div>
        ]
        }
        keyStyle={keyClasses}
        valueStyle={valueClasses}
      />
    </>
  );
};
