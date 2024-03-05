import { useAtom } from 'jotai';
import { useContext, useState } from 'react';
import BufferInput from '@Views/Common/BufferInput';
import { Display } from '@Views/Common/Tooltips/Display';
import { BlueBtn } from '@Views/Common/V2-Button';
import { useLauncherInteractionCalls } from '../Hooks/useLauncherInteractionCalls';
import { toFixed } from '@Utils/NumString';
import { getPosInf, gt, gte } from '@Utils/NumString/stringArithmatics';
import { useGlobal } from '@Contexts/Global';
import { useToast } from '@Contexts/Toast';
import { ViewContext } from '..';
import { erc20ABI, useContractRead } from 'wagmi';
import { IContract } from 'src/Interfaces/interfaces';
import { useGetAllowance, useGetApprovalAmount } from '../../Common/Hooks/useAllowanceCall';
import { IMuchoIndexDataPrice, IMuchoTokenLauncherData, IMuchoTokenMarketData, indexAtom } from '../IndexAtom';
import { MINDEX_CONFIG } from '../Config/mIndexConfig';
import { getBNtoStringCopy } from '@Utils/useReadCall';
import { BigNumber } from 'ethers';
import { t } from 'i18next';

export const IndexBuyMarketModal = ({ isBuy }: { isBuy: boolean }) => {

  const [pageState] = useAtom(indexAtom);
  const { activeChain } = useContext(ViewContext);
  const activeModal = pageState.activeModal;
  const currency = pageState.metadata.tokenPrice;
  //console.log("currency", currency);

  const data: IMuchoTokenMarketData = activeModal.marketData;
  //const priceData: IMuchoIndexDataPrice = data.prices.find(p => p.priceTokenSymbol == currency);
  //const { buyCall } = useLauncherInteractionCalls(priceData);
  const buyCall = () => { };
  const sellCall = () => { };

  return (
    <Buy
      isBuy={isBuy}
      data={data}
      call={isBuy ? buyCall : sellCall}
    />
  );
};

const Common = ({ val, setVal, head, max, unit, precision, currency }) => {
  return (
    <div>
      <div className="text-f15 mb-5">{head}</div>
      <BufferInput
        header={
          <div className="flex flex-row justify-between w-full text-3 text-f14 mt-2">
            <span className="flex flex-row items-center">
              Max:&nbsp;
              <Display data={max} unit={unit} precision={precision} />
            </span>
          </div>
        }
        numericValidations={{
          decimals: { val: 6 },
          max: {
            val: max.toString(),
            error: 'Not enough funds!',
          },
          min: { val: '0', error: 'Enter a positive value' },
        }}
        placeholder="0.0"
        bgClass="!bg-1"
        ipClass="mt-1"
        value={val}
        onChange={(val) => {
          setVal(val);
        }}
        unit={
          <span className="text-f16 flex justify-between w-fit">
            <BlueBtn
              isDisabled={!gt(max, '0')}
              onClick={() => {
                setVal(toFixed(max, 6));
              }}
              className="!py-1 !px-3 !h-fit text-f13 rounded-sm mr-3"
            >
              Max
            </BlueBtn>
            {unit}
          </span>
        }
      />
    </div>
  );
};



const Buy = ({ data, isBuy, call }: { data: IMuchoTokenMarketData, isBuy: boolean, call: any }) => {
  //console.log("DEPOSIT CALL:, call);
  const [val, setVal] = useState('');
  const { activeChain } = useContext(ViewContext);
  const tokenContract: IContract = {
    abi: erc20ABI,
    contract: isBuy ? data.price.buyTokenAddress : data.mTokenContract,
  };
  const { approve } = useGetApprovalAmount(
    tokenContract?.abi,
    tokenContract?.contract,
    MINDEX_CONFIG[activeChain.id].MarketContract
  );
  const toastify = useToast();
  const [approveState, setApprovalState] = useState(false);
  const { state } = useGlobal();
  const allowance = useGetAllowance(priceData.priceTokenAddress, priceData.priceTokenDecimals, MINDEX_CONFIG[activeChain.id].LauncherContract, activeChain.id);

  const isApproved = gte(Number(allowance), val || '1');

  const clickHandler = () => {
    return call(val);
  };

  //console.log("priceData", priceData);
  //console.log("supplydeduct", data.mTokenMaxSupply - data.mTokenCurrentSupply);
  const maxPriceTk = priceData.priceTokenInWallet;
  //const maxPriceTk = maxAirdrop * priceData.price;

  return (
    <>
      <Common
        head={t("index.BuyModalTitle")}
        max={maxPriceTk}
        unit={priceData?.priceTokenSymbol}
        val={val}
        setVal={setVal}
        precision={2}
      />
      <div className="flex whitespace-nowrap mt-5">
        <BlueBtn
          onClick={() => approve(toFixed(val * (10 ** priceData.priceTokenDecimals), 0), setApprovalState)}
          className="mr-4 rounded"
          isDisabled={isApproved || state.txnLoading > 1}
          isLoading={state.txnLoading === 1 && approveState}
        >
          {t("index.ApproveButton")}
        </BlueBtn>
        <BlueBtn
          onClick={clickHandler}
          className="rounded"
          isDisabled={state.txnLoading > 1 || !isApproved}
          isLoading={state.txnLoading === 1 && !approveState}
        >
          {t("index.BuyButton")}
        </BlueBtn>
      </div>
    </>
  );
};
