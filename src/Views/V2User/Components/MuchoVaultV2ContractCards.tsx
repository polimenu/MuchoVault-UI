import { Skeleton } from '@mui/material';
import { Display } from '@Views/Common/Tooltips/Display';
import { TableAligner } from '@Views/Common/TableAligner';
import { IMuchoVaultData, IMuchoVaultParametersInfo, IVaultInfo } from '../v2AdminAtom';
import { Card } from '../../Common/Card/Card';
//import { BADGE_CONFIG } from '../Config/Plans';
import { ViewContext } from '..';
import { useContext } from 'react';
import { VaultButtons } from './MuchoVaultV2UserButtons';
import { contractLink } from '@Views/Common/Utils';
import { BufferProgressBar } from '@Views/Common/BufferProgressBar.tsx';
import { Divider } from '@Views/Common/Card/Divider';
import { V2USER_CONFIG } from '../Config/v2UserConfig';
import { Chain } from 'wagmi';
import { NFTButtons } from './NFTButtons';
import { t } from 'i18next';
export const keyClasses = '!text-f15 !text-2 !text-left !py-[6px] !pl-[0px]';
export const valueClasses = '!text-f15 text-1 !text-right !py-[6px] !pr-[0px]';
export const tooltipKeyClasses = '!text-f14 !text-2 !text-left !py-1 !pl-[0px]';
export const tooltipValueClasses =
  '!text-f14 text-1 !text-right !py-1 !pr-[0px]';
export const underLineClass =
  'underline underline-offset-4 decoration decoration-[#ffffff30]  w-fit ml-auto';


export const wrapperClasses = 'flex justify-end flex-wrap';



export const getMuchoVaultV2UserCards = (data: IMuchoVaultData) => {
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


  const vaultsInfo = data.vaultsInfo.map((v, i) => <MuchoVaultInfoCard vaultId={i} vaultInfo={v} precision={V2USER_CONFIG[activeChain.id].MuchoVault.precision[i]} data={data} />);
  const nftInfo = <NFTInfoCard data={data} />;

  return [...vaultsInfo, nftInfo];
};


const MuchoVaultInfoCard = ({ vaultId, vaultInfo, precision, data }: { vaultId: number, vaultInfo: IVaultInfo, precision: number, data: IMuchoVaultData }) => {
  if (!vaultInfo) {
    return <Skeleton
      key={vaultId}
      variant="rectangular"
      className="w-full !h-full min-h-[370px] !transform-none !bg-1"
    />
  }
  const nftData = getNftData(data);
  return (
    <Card
      top={
        <>
          <span className={underLineClass}>{t("v2.VaultTitle", { vaultName: vaultInfo.depositToken.name })}</span>
          <div className="text-f12 text-3  mt-2">
            {t("v2.Max Capacity")}&nbsp;:&nbsp;
            <Display
              data={vaultInfo.maxCap}
              unit={vaultInfo.depositToken.name}
              className="inline"
              disable
              precision={2}
            />
            &nbsp;(<Display
              data={Number(vaultInfo.totalStaked > 0 ? vaultInfo.totalUSDStaked * vaultInfo.maxCap / vaultInfo.totalStaked : 0)}
              label={"$ "}
              className="inline"
              disable
              precision={0}
            />)
          </div>
          <div className="max-w-[300px]">
            <BufferProgressBar
              fontSize={12}
              progressPercent={Number(100 * vaultInfo.totalStaked / vaultInfo.maxCap)}
            />
          </div>
        </>
      }
      middle={<>
        <MuchoVaultInfo vaultInfo={vaultInfo} precision={precision} nftApr={nftData.nftApr} />
      </>}
      bottom={
        <div className="mt-5">
          <VaultButtons data={vaultInfo} />
        </div>
      }
    />
  );
}

const MuchoVaultInfo = ({ vaultInfo, precision, nftApr }: { vaultInfo: IVaultInfo, precision: number, nftApr: number }) => {
  //console.log("Plan:"); console.log(plan);
  //console.log("Enabled:"); console.log(enabledStr);
  const muchoToDepositExchange = Number(vaultInfo.muchoToken.supply) > 0 ? Number(vaultInfo.totalStaked / vaultInfo.muchoToken.supply) : 1;
  //console.log("muchoToDepositExchange", muchoToDepositExchange);
  //console.log("vaultInfo.muchoToken.supply", vaultInfo.muchoToken.supply);
  //console.log("vaultInfo.totalStaked", vaultInfo.totalStaked);
  const userUsdDeposited = vaultInfo.userData.muchoTokens * muchoToDepositExchange * vaultInfo.totalUSDStaked / vaultInfo.totalStaked;
  const totalApr = nftApr + vaultInfo.expectedAPR;

  //console.log("userNftAnnualEarnings", userNftAnnualEarnings);
  //console.log("annualEarningsNftVault", annualEarningsNftVault);
  //console.log("totalUserInvested", totalUserInvested);
  //console.log("userUsdDeposited", userUsdDeposited);

  return (
    <>
      <TableAligner
        keysName={
          [t('v2.Receipt current price'), t('v2.Total Staked in Vault'), 'APR']
        }
        values={[
          <div className={`${wrapperClasses}`}>

            <Display
              className="!justify-end"
              data={1}
              unit={vaultInfo.muchoToken.name}
              precision={0}
            />
            &nbsp;=&nbsp;
            <Display
              className="!justify-end"
              data={muchoToDepositExchange}
              unit={vaultInfo.depositToken.name}
              precision={4}
            />
          </div>,
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={vaultInfo.totalStaked}
              unit={vaultInfo.depositToken.name}
              precision={precision}
            />
            &nbsp;(
            <Display
              className="!justify-end"
              data={vaultInfo.totalUSDStaked}
              unit={"$"}
              precision={2}
            />
            )
          </div>
          ,
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={totalApr}
              unit={"%"}
              precision={2}
              content={
                <span>
                  <TableAligner
                    keysName={[t('v2.Vault APR'), t('v2.NFT Bonus APR')]}
                    keyStyle={tooltipKeyClasses}
                    valueStyle={tooltipValueClasses}
                    values={[<div className={`${wrapperClasses}`}>
                      <Display
                        className="!justify-end"
                        data={vaultInfo.expectedAPR}
                        unit={"%"}
                        precision={2}
                      />
                    </div>,
                    <div className={`${wrapperClasses}`}>
                      <Display
                        className="!justify-end"
                        data={nftApr}
                        unit={"%"}
                        precision={2}
                      />
                    </div>,]}
                  ></TableAligner>
                  <div className="text-left mt-3 text-f14">
                    {nftApr > 0 && t("v2.aprNote")}
                    {nftApr == 0 && t("v2.noNftNote")}
                  </div>
                </span>
              }
            />
          </div>,

        ]
        }
        keyStyle={keyClasses}
        valueStyle={valueClasses}
      />
      <Divider />

      <TableAligner
        keysName={
          [t('v2.User staked'), t('v2.User (not staked) tokens in wallet')]
        }
        values={[

          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={vaultInfo.userData.muchoTokens * muchoToDepositExchange}
              unit={vaultInfo.depositToken.name}
              precision={precision}
            />
            &nbsp;(
            <Display
              className="!justify-end"
              data={userUsdDeposited}
              unit={"$"}
              precision={2}
            />
            )
          </div>,
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={vaultInfo.userData.depositTokens}
              unit={vaultInfo.depositToken.name}
              precision={precision}
            />
            &nbsp;(
            <Display
              className="!justify-end"
              data={vaultInfo.userData.depositTokens * vaultInfo.totalUSDStaked / vaultInfo.totalStaked}
              unit={"$"}
              precision={2}
            />
            )
          </div>
          ,
        ]
        }
        keyStyle={keyClasses}
        valueStyle={valueClasses}
      />

      <Divider />

      <TableAligner
        keysName={
          [t('v2.Deposit Fee')/*, 'Withdraw Fee', 'Max Deposit per user'*/]
        }
        values={[
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={vaultInfo.depositFee}
              unit={"%"}
              precision={2}
            />
          </div>/*,
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={vaultInfo.withdrawFee}
              unit={"%"}
              precision={2}
            />
          </div>,
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={vaultInfo.maxDepositUser}
              unit={vaultInfo.depositToken.name}
              precision={precision}
            />
          </div>,*/
        ]
        }
        keyStyle={keyClasses}
        valueStyle={valueClasses}
      />
    </>
  );
};




const NFTInfoCard = ({ data }: { data: IMuchoVaultData }) => {
  if (!data) {
    return <Skeleton
      key="NFTData"
      variant="rectangular"
      className="w-full !h-full min-h-[370px] !transform-none !bg-1"
    />
  }
  return (
    <Card
      top={
        <>
          <span className={underLineClass}>{t('v2.(mucho) Subscription Plan Bonus')}</span>
          <div className="text-f12 text-3  mt-2" dangerouslySetInnerHTML={{ __html: t("v2.NftHero") }}>
          </div>
        </>
      }
      middle={<>
        <NFTInfo data={data} />
      </>}
      bottom={
        <div className="mt-5">
          <NFTButtons data={data} />
        </div>
      }
    />
  );
}

const getNftData = (data: IMuchoVaultData) => {
  let totalUserInvested = 0;
  data.vaultsInfo.forEach(v => totalUserInvested += v.muchoToken.supply == 0 ? 0 : v.userData.muchoTokens * v.totalUSDStaked / v.muchoToken.supply);
  const userPortion = data.badgeInfo.totalPonderatedInvestment > 0 ? 100 * totalUserInvested * data.badgeInfo.userBadgeData.planMultiplier / data.badgeInfo.totalPonderatedInvestment : 0;
  const userExpectedEarnings = userPortion * data.badgeInfo.annualEarningExpected / 100;
  const nftApr = totalUserInvested > 0 ? 100 * userExpectedEarnings / totalUserInvested : 0;

  return { totalUserInvested, userPortion, userExpectedEarnings, nftApr };
}


const NFTInfo = ({ data }: { data: IMuchoVaultData }) => {

  const { totalUserInvested, userPortion, userExpectedEarnings, nftApr } = getNftData(data);
  const currentRewardsAmount = data.badgeInfo.userBadgeData.currentRewards.amount;
  const rewardsVault = data.vaultsInfo.find(v => v.depositToken.contract == data.badgeInfo.userBadgeData.currentRewards.token.contract)?.id;
  const rewardsExchange = data.vaultsInfo[rewardsVault] ? data.vaultsInfo[rewardsVault].totalUSDStaked / data.vaultsInfo[rewardsVault].totalStaked : 0;
  const currentRewardsUSD = currentRewardsAmount * rewardsExchange;

  return (
    <>

      <TableAligner
        keysName={
          [t('v2.Your Subscription plan'), t('v2.Your Plan Multiplier'), t('v2.Your Total Investment')]
        }
        values={[
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={data.badgeInfo.userBadgeData.planName}
            />
          </div>,
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={data.badgeInfo.userBadgeData.planMultiplier}
              unit="x"
            />
          </div>,
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={totalUserInvested}
              unit="$"
            />
          </div>,

        ]
        }
        keyStyle={keyClasses}
        valueStyle={valueClasses}
      />
      <Divider />

      <TableAligner
        keysName={
          [t('v2.Annual Expected Yield for NFT Holders'), t('v2.Your current share'), t('v2.Your expected annual NFT Bonus Yield')]
        }
        values={[
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={data.badgeInfo.annualEarningExpected}
              unit="$"
              precision={2}
            />
          </div>,
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={userPortion}
              unit="%"
              precision={2}
            />
          </div>,
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={userExpectedEarnings}
              unit="$"
              precision={2}
            />
          </div>,
        ]
        }
        keyStyle={keyClasses}
        valueStyle={valueClasses}
      />
      <Divider />

      <TableAligner
        keysName={
          [t('v2.Your NFT Bonus APR'), t('v2.Your Accumulated Rewards')]
        }
        values={[
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={nftApr}
              unit="%"
            />
          </div>,
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={data.badgeInfo.userBadgeData.currentRewards.amount}
              unit={data.badgeInfo.userBadgeData.currentRewards.token.name}
              precision={7}
            />&nbsp;(<Display
              className="!justify-end"
              data={currentRewardsUSD}
              unit={"$"}
              precision={4}
            />)
          </div>,

        ]
        }
        keyStyle={keyClasses}
        valueStyle={valueClasses}
      />

    </>
  );
};