import { Skeleton } from '@mui/material';
import FrontArrow from 'src/SVG/frontArrow';
import { BufferProgressBar } from '@Views/Common/BufferProgressBar.tsx';
import NumberTooltip from '@Views/Common/Tooltips';
import { Display } from '@Views/Common/Tooltips/Display';
import { TableAligner } from '@Views/V2-Leaderboard/Components/TableAligner';
import { IEarn, IPoolInfo } from '../earnAtom';
import { Card } from './Card';
import { Divider } from './Divider';
import { EarnButtons } from './EarnButtons';
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
  return [
    <EarnCard token="USDC" muchoToken="muchoUSDC" poolInfo={data.earn.USDCPoolInfo} vaultId={0} decimals={6} precision={2} />,
    <EarnCard token="WETH" muchoToken="muchoETH" poolInfo={data.earn.WETHPoolInfo} vaultId={1} decimals={18} precision={5} />,
    <EarnCard token="WBTC" muchoToken="muchoBTC" poolInfo={data.earn.WBTCPoolInfo} vaultId={2} decimals={10} precision={6} />,
  ];
};



const EarnCard = ({ token, muchoToken, poolInfo, vaultId, decimals, precision }: { token: string, muchoToken: string, poolInfo: IPoolInfo, vaultId: number, decimals: number, precision: number }) => {
  //console.log("EarnCard");
  return (
    <Card
      top={
        <>
          <NumberTooltip
            content={
              <>
                Deposita {token}, que usaremos en combinación con los otros pools para comprar GLP, ganando y distribuyendo los
                rewards del staking sin impermanent loss.{' '}
                <a
                  href="https://buffer-finance.medium.com/all-you-need-to-know-about-usdc-vaults-liqudity-pool-and-the-blp-token-d743b258da1d"
                  target={'_blank'}
                  className="text-light-blue whitespace-nowrap hover:underline"
                >
                  más detalles aquí
                  <FrontArrow className="tml w-fit inline" />
                </a>
              </>
            }
            className="!py-3"
          >
            <span className={underLineClass}>{token} Vault ({muchoToken} Token)</span>
          </NumberTooltip>

          <div className="text-f12 text-3  mt-2">
            Max Capacity&nbsp;:&nbsp;
            <Display
              data={poolInfo.vaultcap}
              unit={token}
              className="inline"
              disable
              precision={precision}
            />
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
          </div>,
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={Number(poolInfo.muchoTotalSupply) > 0 ? Number(poolInfo.userMuchoInWallet * poolInfo.totalStaked / poolInfo.muchoTotalSupply) : 0}
              unit={primaryUnit}
              precision={precision}
            />
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
