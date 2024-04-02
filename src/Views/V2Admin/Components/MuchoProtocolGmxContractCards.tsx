import { Skeleton } from '@mui/material';
import { Display } from '@Views/Common/Tooltips/Display';
import { TableAligner } from '@Views/Common/TableAligner';
import { IGmxTokenInfo, IMuchoProtocolGmxData } from '../v2AdminAtom';
import { Card } from '../../Common/Card/Card';
//import { BADGE_CONFIG } from '../Config/Plans';
import { ViewContext } from '..';
import { useContext } from 'react';
import { CheckBox } from '@mui/icons-material';
import { MuchoHubTokenButtons } from './MuchoHubV2AdminButtons';
import { contractLink } from '@Views/Common/Utils';
import { MuchoGmxGeneralButtons, MuchoGmxTokenButtons } from './MuchoProtocolGmxAdminButtons';
import { V2ADMIN_CONFIG } from '../Config/v2AdminConfig';
import { Divider } from '@Views/Common/Card/Divider';
export const keyClasses = '!text-f15 !text-2 !text-left !py-[6px] !pl-[0px]';
export const valueClasses = '!text-f15 text-1 !text-right !py-[6px] !pr-[0px]';
export const tooltipKeyClasses = '!text-f14 !text-2 !text-left !py-1 !pl-[0px]';
export const tooltipValueClasses =
  '!text-f14 text-1 !text-right !py-1 !pr-[0px]';
export const underLineClass =
  'underline underline-offset-4 decoration decoration-[#ffffff30]  w-fit ml-auto';


export const wrapperClasses = 'flex justify-end flex-wrap';



export const getMuchoProtocolGmxAdminCards = (data: IMuchoProtocolGmxData, version: number) => {
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

  const tokensInfo = data.tokenInfo ? data.tokenInfo.map((v, i) => <MuchoGmxTokenInfoCard tokenInfo={v} manualWeights={data.manualModeWeights} precision={7} version={version} />) : [];
  const generalCard = <MuchoGmxGeneralCard muchoGmxData={data} version={version} />;
  const contractsCard = <MuchoGmxContractsCard muchoGmxData={data} />;

  return [generalCard, contractsCard, ...tokensInfo];
};


const MuchoGmxContractsCard = ({ muchoGmxData }: { muchoGmxData: IMuchoProtocolGmxData }) => {
  //console.log("PlanCard");
  return (
    <Card
      top={
        <>
          <span className={underLineClass}>Linked Contracts</span>
        </>
      }
      middle={<>
        <MuchoGmxContractsInfo info={muchoGmxData} />
      </>}
      bottom={
        <div className="mt-5">
          {<></>}
        </div>
      }
    />
  );
}

const MuchoGmxGeneralCard = ({ muchoGmxData, version }: { muchoGmxData: IMuchoProtocolGmxData, version: number }) => {
  //console.log("PlanCard");
  return (
    <Card
      top={
        <>
          <span className={underLineClass}>{contractLink(muchoGmxData.contract, "MuchoProtocol Gmx Contract General Params")}</span>
        </>
      }
      middle={<>
        <MuchoGmxParametersInfo info={muchoGmxData} />
      </>}
      bottom={
        <div className="mt-5">
          <MuchoGmxGeneralButtons data={muchoGmxData} version={version} />
        </div>
      }
    />
  );
}

const MuchoGmxTokenInfoCard = ({ tokenInfo, manualWeights, precision, version }: { tokenInfo: IGmxTokenInfo, manualWeights: boolean, precision: number, version: number }) => {
  if (!tokenInfo) {
    return <Skeleton
      key=""
      variant="rectangular"
      className="w-full !h-full min-h-[370px] !transform-none !bg-1"
    />
  }
  return (
    <Card
      top={
        <>
          <span className={underLineClass}>Token {contractLink(tokenInfo.token.contract, tokenInfo.token.name)}</span>
        </>
      }
      middle={<>
        <MuchoGmxTokenInfo tokenInfo={tokenInfo} precision={precision} />
      </>}
      bottom={
        <div className="mt-5">
          {<MuchoGmxTokenButtons data={tokenInfo} manualWeights={manualWeights} precision={precision} version={version} />}
        </div>
      }
    />
  );
}

const MuchoGmxTokenInfo = ({ tokenInfo, precision }: { tokenInfo: IGmxTokenInfo, precision: number }) => {
  //console.log("Sec tokens", tokenInfo.secondaryTokens);

  return (
    <>
      <TableAligner
        keysName={
          ['Secondary Tokens', 'Total Staked', 'Total Invested', 'Total Not Invested', 'Actual vs GLP Weight']
        }
        values={[
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={<ul>
                {tokenInfo.secondaryTokens.length == 0 ? <li>None</li> : tokenInfo.secondaryTokens.map(t => <li key={t.contract}>{contractLink(t.contract, t.name)}</li>)}
              </ul>}
            />
          </div>,
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={tokenInfo.staked}
              unit={tokenInfo.token.name}
              precision={precision}
            />
          </div>,
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={tokenInfo.invested}
              unit={tokenInfo.token.name}
              precision={precision}
            />
          </div>,
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={tokenInfo.notInvested}
              unit={tokenInfo.token.name}
              precision={precision}
            />
          </div>,
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={tokenInfo.investedWeight}
              unit="%"
              precision={2}
            /> &nbsp; / &nbsp;
            <Display
              className="!justify-end"
              data={tokenInfo.desiredWeight}
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


const MuchoGmxParametersInfo = ({ info }: { info: IMuchoProtocolGmxData }) => {
  //console.log("Plan:"); console.log(plan);
  //console.log("Enabled:"); console.log(enabledStr);
  const backing: number = info.totalUSDStaked > 0 ? 100 * info.totalUSDBacked / info.totalUSDStaked : 0;
  return (
    <>
      <TableAligner
        keysName={['Total USD Staked', 'Total USD Backed', '% Backing']}
        values={[
          <div className={`${wrapperClasses}`}><Display className="!justify-end" data={info.totalUSDStaked} unit="$" precision={2} /></div>,
          <div className={`${wrapperClasses}`}><Display className="!justify-end" data={info.totalUSDBacked} unit="$" precision={2} /></div>,
          <div className={`${wrapperClasses}`}><Display className="!justify-end" data={backing} unit="%" precision={2} /></div>,
        ]}
        keyStyle={keyClasses}
        valueStyle={valueClasses}
      />
      <Divider></Divider>
      <TableAligner
        keysName={['GLP APR', 'GLP WETH Mint fee', 'Slippage', 'Owner Earnings Address', 'Claim Es Gmx',
          'Min Not Invested Percentage', 'Desired Not Invested Percentage', 'Min % Move', 'Max Lapse Without Weight Refresh', 'Manual Weights', 'Owner Rewards Percentage', 'NFT Rewards Percentage', 'Compound Protocol']}
        values={[
          <div className={`${wrapperClasses}`}><Display className="!justify-end" data={info.glpApr} unit="%" precision={2} /></div>,
          <div className={`${wrapperClasses}`}><Display className="!justify-end" data={info.glpWethMintFee} unit="%" precision={2} /></div>,
          <div className={`${wrapperClasses}`}><Display className="!justify-end" data={info.slippage} unit="%" precision={3} /></div>,

          <div className={`${wrapperClasses}`}><Display className="!justify-end" data={contractLink(info.earningsAddress)} /></div>,
          <div className={`${wrapperClasses}`}><Display className="!justify-end" data={<input type="checkbox" readOnly checked={info.claimEsGmx} />} /></div>,

          <div className={`${wrapperClasses}`}><Display className="!justify-end" data={info.minNotInvestedPercentage} unit="%" precision={2} /></div>,
          <div className={`${wrapperClasses}`}><Display className="!justify-end" data={info.desiredNotInvestedPercentage} unit="%" precision={2} /></div>,
          <div className={`${wrapperClasses}`}><Display className="!justify-end" data={info.minBasisPointsMove} unit="%" precision={2} /></div>,
          <div className={`${wrapperClasses}`}><Display className="!justify-end" data={info.maxRefreshWeightLapse} unit="H" precision={1} /></div>,

          <div className={`${wrapperClasses}`}><Display className="!justify-end" data={<input type="checkbox" readOnly checked={info.manualModeWeights} />} /></div>,

          <div className={`${wrapperClasses}`}><Display className="!justify-end" data={info.rewardSplit.ownerPercentage} unit="%" precision={2} /></div>,
          <div className={`${wrapperClasses}`}><Display className="!justify-end" data={info.rewardSplit.NftPercentage} unit="%" precision={2} /></div>,

          <div className={`${wrapperClasses}`}><Display className="!justify-end" data={contractLink(info.compoundProtocol)} /></div>,
        ]}
        keyStyle={keyClasses}
        valueStyle={valueClasses}
      />
    </>
  );
};

const MuchoGmxContractsInfo = ({ info }: { info: IMuchoProtocolGmxData }) => {
  //console.log("Plan:"); console.log(plan);
  //console.log("Enabled:"); console.log(enabledStr);
  const contractList = ['EsGMX', 'fsGLP', 'WETH', 'glpRouter', 'glpRewardRouter', 'poolGLP', 'muchoRewardRouter', 'priceFeed'];
  return (
    <TableAligner
      keysName={contractList}
      values={contractList.map(c => <div className={`${wrapperClasses}`}><Display className="!justify-end" data={contractLink(info.contracts[c])} /></div>)}
      keyStyle={keyClasses}
      valueStyle={valueClasses}
    />
  );
};