import { Skeleton } from '@mui/material';
import { Display } from '@Views/Common/Tooltips/Display';
import { TableAligner } from '@Views/Common/TableAligner';
import { IIndexAum, IMuchoIndexTotalBalance } from '../IndexAtom';
import { Card } from '../../Common/Card/Card';

export const keyClasses = '!text-f15 !text-2 !text-left !py-[6px] !pl-[0px]';
export const valueClasses = '!text-f15 text-1 !text-right !py-[6px] !pr-[0px]';
export const tooltipKeyClasses = '!text-f14 !text-2 !text-left !py-1 !pl-[0px]';
export const tooltipValueClasses =
  '!text-f14 text-1 !text-right !py-1 !pr-[0px]';
export const underLineClass =
  'underline underline-offset-4 decoration decoration-[#ffffff30]  w-fit ml-auto';


export const wrapperClasses = 'flex justify-end flex-wrap';


export const getMuchoIndexAdminCards = (data: IIndexAum | null) => {

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

  console.log("Drawing cards with data", data);


  return [<MuchoIndexAdminAllNetworksCard data={data} title='All Networks' />,
  ...data.aum.networks.map(n => <MuchoIndexAdminNetworkCard data={n.totalBalance} title={n.network.toLocaleUpperCase()} />)];
}

const MuchoIndexAdminNetworkCard = ({ data, title }: { data: IMuchoIndexTotalBalance, title: string }) => {

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
          <span >{title}</span>
        </>
      }
      middle={<>
        {<MuchoIndexAdminInfo totalBalance={data} />}
      </>}
    />
  );
}

const MuchoIndexAdminAllNetworksCard = ({ data, title }: { data: IIndexAum, title: string }) => {

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
          <span >{title}</span>
          <div className="text-f12 text-3  mt-2">
            Price:&nbsp;&nbsp;&nbsp;&nbsp;
            <Display
              data={data.price}
              className="inline"
              unit='$'
              disable
              precision={4}
            />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            Supply:&nbsp;&nbsp;&nbsp;&nbsp;
            <Display
              data={data.aum.totalBalance.totalUsd / data.price}
              className="inline"
              unit=''
              disable
              precision={0}
            />
          </div>
        </>
      }
      middle={<>
        {<MuchoIndexAdminInfo totalBalance={data.aum.totalBalance} />}
      </>}
    />
  );
}


const MuchoIndexAdminInfo = ({ totalBalance }: { totalBalance: IMuchoIndexTotalBalance }) => {
  return (
    <>
      <TableAligner
        keysName={
          [
            "Total USD",
            <b>Strategies:</b>,
            ...totalBalance.totalByStrategy.sort((a, b) => b.usd - a.usd).map(ts => <>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{ts.strategy}</>),
            <b>Tokens:</b>,
            ...totalBalance.totalByToken.sort((a, b) => b.usd - a.usd).map(ts => <>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{ts.token}</>),
          ]
        }
        values={[
          <div className={`${wrapperClasses}`}>

            <Display
              className="!justify-end"
              data={totalBalance.totalUsd}
              unit={"$"}
              precision={2}
            />
          </div>,
          <></>,

          ...totalBalance.totalByStrategy.sort((a, b) => b.usd - a.usd).map(ts => <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={ts.usd}
              unit={"$"}
              precision={2}
            />
          </div>),
          <></>,

          ...totalBalance.totalByToken.sort((a, b) => b.usd - a.usd).map(ts => <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={ts.balance}
              unit={ts.token}
              precision={2}
            />&nbsp;&nbsp;&nbsp;(<Display
              className="!justify-end"
              data={ts.usd}
              unit={"$"}
              precision={2}
            />)
          </div>),
        ]
        }
        keyStyle={keyClasses}
        valueStyle={valueClasses}
      />
    </>
  );
};
