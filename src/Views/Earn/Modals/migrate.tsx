import { useAtom } from 'jotai';
import { useContext, useState } from 'react';
import BufferInput from '@Views/Common/BufferInput';
import { Display } from '@Views/Common/Tooltips/Display';
import { BlueBtn } from '@Views/Common/V2-Button';
import { IPoolInfo, earnAtom, readEarnData } from '../earnAtom';
import {
  useEarnWriteCalls, useMigrateCalls,
} from '../Hooks/useEarnWriteCalls';
import { EARN_CONFIG } from '../Config/Pools';
import { toFixed } from '@Utils/NumString';
import { getPosInf, gt, gte } from '@Utils/NumString/stringArithmatics';
import { useGlobal } from '@Contexts/Global';
import { useToast } from '@Contexts/Toast';
import { EarnContext } from '..';
import { erc20ABI } from 'wagmi';
import { IContract } from 'src/Interfaces/interfaces';
import { useGetAllowance, useGetApprovalAmount } from '../../Common/Hooks/useAllowanceCall';
import { getActiveChain } from 'config';
import { useActiveChain } from '@Hooks/useActiveChain';

export const MigrateModal = ({
  head
}: {
  head: string;
}) => {

  const { activeChain } = useActiveChain();
  const [pageState] = useAtom(earnAtom);
  const activeModal = pageState.activeModal;
  const poolInfo = activeModal.poolInfo;
  const muchoExchange = poolInfo.totalStaked / poolInfo.muchoTotalSupply;
  const amount = poolInfo.userMuchoInWallet * muchoExchange;

  //Swap usc.e to usdc:
  const tokenV2 = (activeModal.vaultId == 0) ? "0xaf88d065e77c8cC2239327C5EDb3A432268e5831" : poolInfo.lpToken;

  //console.log("activeChain", activeChain);

  const tokenV1Symbol = EARN_CONFIG[activeChain.id].POOLS[activeModal.vaultId].token.symbol;
  const tokenV2Symbol = (activeModal.vaultId == 0) ? "USDC" : tokenV1Symbol;
  const amountBeautified = (activeModal.vaultId == 0) ? Math.round(amount * 10 ** 2) / 10 ** 2 : Math.round(amount * 10 ** 7) / 10 ** 7

  const [message, setMessage] = useState(<>You will be asked to sign multiple transaction to complete the migration. <br /><br />Note there will be a small loss due to the v2 deposit fee (around 0.50%, used form minting and burning GLP)</>);

  //console.log("v1 and v2 token", poolInfo.lpToken, tokenV2);
  //console.log("v1 and v2 symbol", tokenV1Symbol);

  const { withdrawCall } = useMigrateCalls(activeModal.vaultId, activeModal.decimals,
    poolInfo.lpToken,
    tokenV2,
    poolInfo.userMuchoInWallet,
    muchoExchange, setMessage, message,
    tokenV1Symbol,
    tokenV2Symbol);

  return <Migrate call={withdrawCall} message={message} amountBeautified={amountBeautified} tokenV2Symbol={tokenV2Symbol} />;

};


const Migrate = ({ call, message, amountBeautified, tokenV2Symbol }) => {
  const [isDisabled, setDisabled] = useState(false);
  const descStyles = 'w-[46rem] text-center m-auto tab:w-full mb-5 text-f16 pr-5 pl-5';

  const clickHandler = () => {
    setDisabled(true);
    return call();
  };
  return (
    <>
      <div className={descStyles}>{message}</div>
      <BlueBtn
        className={'px-4 rounded-sm !h-7 w-full mt-5'}
        onClick={clickHandler}
        isDisabled={isDisabled}
      >
        Migrate my {amountBeautified}
        &nbsp;{tokenV2Symbol} from V1 to V2 vault
      </BlueBtn>
    </>
  );
};
