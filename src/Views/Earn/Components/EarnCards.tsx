import { Skeleton } from '@mui/material';
import { BufferProgressBar } from '@Views/Common/BufferProgressBar.tsx';
import { Display } from '@Views/Common/Tooltips/Display';
import { TableAligner } from '@Views/Common/TableAligner';
import { IEarn, IPoolInfo, IProtocolInfo } from '../earnAtom';
import { Card } from './Card';
import { Divider } from './Divider';
import { EarnButtons } from './EarnButtons';
import { EARN_CONFIG } from '../Config/Pools';
import { EarnContext } from '..';
import { useContext } from 'react';
export const keyClasses = '!text-f15 !text-2 !text-left !py-[6px] !pl-[0px]';
export const valueClasses = '!text-f15 text-1 !text-right !py-[6px] !pr-[0px]';
export const tooltipKeyClasses = '!text-f14 !text-2 !text-left !py-1 !pl-[0px]';
export const tooltipValueClasses =
  '!text-f14 text-1 !text-right !py-1 !pr-[0px]';
export const underLineClass =
  'underline underline-offset-4 decoration decoration-[#ffffff30]  w-fit ml-auto';


export const wrapperClasses = 'flex justify-end flex-wrap';

export const getEarnCards = (data: IEarn) => {
  //console.log("getEarnCards 0");
  if (!data?.earn) {
    //console.log("getEarnCards 1");
    return [0, 1, 2, 3].map((index) => (
      <Skeleton
        key={index}
        variant="rectangular"
        className="w-full !h-full min-h-[370px] !transform-none !bg-1"
      />
    ));
  }
  //console.log("getEarnCards");
  //console.log(data);
  let activeChain: Chain | null = null;
  const earnContextValue = useContext(EarnContext);
  if (earnContextValue) {
    activeChain = earnContextValue.activeChain;
  }

  const earnCards = EARN_CONFIG[activeChain.id].POOLS.map((p, i) => {
    return <EarnCard token={p.token.symbol} muchoToken={p.mToken.symbol} poolInfo={data.earn[`${p.token.symbol}PoolInfo`]} vaultId={i} decimals={p.decimals} precision={p.precision} />
  });

  return [
    ...earnCards,
    data.earn.ProtocolInfo && <ProtocolInfoCard protocolInfo={data.earn.ProtocolInfo} />
  ];
};



const EarnCard = ({ token, muchoToken, poolInfo, vaultId, decimals, precision }: { token: string, muchoToken: string, poolInfo: IPoolInfo, vaultId: number, decimals: number, precision: number }) => {
  //console.log("EarnCard");
  return (
    <Card
      top={
        <>
          <span className={underLineClass}>{token} Vault ({muchoToken} Token)</span>
          <div className="text-f12 text-3  mt-2">
            Max Capacity&nbsp;:&nbsp;
            <Display
              data={poolInfo.vaultcap}
              unit={token}
              className="inline"
              disable
              precision={precision}
            />
            &nbsp;(<Display
              data={Number(poolInfo.exchangeUSD * poolInfo.vaultcap)}
              label={"$ "}
              className="inline"
              disable
              precision={0}
            />)
          </div>
          <div className="max-w-[300px]">
            <BufferProgressBar
              fontSize={12}
              progressPercent={Number(100 * poolInfo.totalStaked / poolInfo.vaultcap)}
            />
          </div>
        </>
      }
      middle={<VaultInfo poolInfo={poolInfo} unit={muchoToken} primaryUnit={token} precision={precision} />}
      bottom={
        <div className="mt-5">
          <EarnButtons poolInfo={poolInfo} primaryToken={token} vaultId={vaultId} decimals={decimals} precision={precision} />
        </div>
      }
    />
  );
}

const VaultInfo = ({ poolInfo, unit, primaryUnit, precision }: { poolInfo: IPoolInfo; unit: string, primaryUnit: string, precision: number }) => {

  return (
    <>
      <TableAligner
        keysName={['Receipt price', 'Wallet', 'User Staked']}
        values={[
          <div className={`${wrapperClasses}`}>

            <Display
              className="!justify-end"
              data={1}
              unit={unit}
              precision={0}
            />
            &nbsp;=&nbsp;
            <Display
              className="!justify-end"
              data={Number(poolInfo.muchoTotalSupply) > 0 ? Number(poolInfo.totalStaked / poolInfo.muchoTotalSupply) : 1}
              unit={primaryUnit}
              precision={4}
            />
          </div>,
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={poolInfo.userAvailableInWallet}
              unit={primaryUnit}
              precision={precision}
            />

            &nbsp;(<Display
              data={Number(poolInfo.exchangeUSD * poolInfo.userAvailableInWallet)}
              label={"$"}
              className="inline"
              disable
              precision={2}
            />)
          </div>,
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={Number(poolInfo.muchoTotalSupply) > 0 ? Number(poolInfo.userMuchoInWallet * poolInfo.totalStaked / poolInfo.muchoTotalSupply) : 0}
              unit={primaryUnit}
              precision={precision}
            />
            &nbsp;(<Display
              data={Number(poolInfo.exchangeUSD * (Number(poolInfo.muchoTotalSupply) > 0 ? Number(poolInfo.userMuchoInWallet * poolInfo.totalStaked / poolInfo.muchoTotalSupply) : 0))}
              label={"$"}
              className="inline"
              disable
              precision={2}
            />)
          </div>,
        ]}
        keyStyle={keyClasses}
        valueStyle={valueClasses}
      />
      <Divider />
      <TableAligner
        keysName={[
          'APR',
        ]}
        values={[
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={poolInfo.APR}
              placement="bottom"
              unit="%"
            />{' '}
          </div>,

          ,
        ]}
        keyStyle={keyClasses}
        valueStyle={valueClasses}
      />
      <Divider />
      <TableAligner
        keysName={['Total Staked in Pool', 'Deposit Fee']}
        values={[
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={poolInfo.totalStaked}
              unit={primaryUnit}
              precision={precision}
            />
            &nbsp;(<Display
              data={Number(poolInfo.exchangeUSD * poolInfo.totalStaked)}
              label={"$"}
              className="inline"
              disable
              precision={2}
            />)
          </div>,
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={poolInfo.glpFees}
              unit="%"
              precision={2}
            />

          </div>,
        ]}
        keyStyle={keyClasses}
        valueStyle={valueClasses}
      />
    </>
  );
};



const ProtocolInfoCard = ({ protocolInfo }: { protocolInfo: IProtocolInfo }) => {
  //console.log("EarnCard");
  return (
    <Card
      top={
        <>
          <span className={underLineClass}>MuchoVault Info</span>
        </>
      }
      middle={<ProtocolInfo protocolInfo={protocolInfo} />}
      bottom={
        <div className="mt-5">
        </div>
      }
    />
  );
}


const ProtocolInfo = ({ protocolInfo }: { protocolInfo: IProtocolInfo }) => {

  return (
    <>
      <TableAligner
        keysName={['TVL', 'GLP Treasury', 'Backing Coverage']}
        values={[
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={Number(protocolInfo.TVL)}
              label="$"
              precision={0}
            />
          </div>,
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={Number(protocolInfo.GLP)}
              unit={"GLP"}
              precision={2}
            />
            &nbsp;
            (
            <Display
              className="!justify-end"
              data={Number(protocolInfo.GLP * protocolInfo.GLPtoUSD)}
              label="$"
              precision={2}
            />)
          </div>,
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={Number(100 * protocolInfo.GLP / protocolInfo.GLPNeeded)}
              unit={"%"}
              precision={2}
            />
          </div>
        ]}
        keyStyle={keyClasses}
        valueStyle={valueClasses}
      />
    </>
  );
};