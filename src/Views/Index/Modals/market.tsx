import { CloseOutlined } from '@mui/icons-material';
import { Dialog, IconButton } from '@mui/material';
import { useAtom } from 'jotai';
import { IIndexPrice, IMuchoIndexDataPrice, IMuchoTokenLauncherData, IMuchoTokenMarketData, indexAtom } from '../IndexAtom';
import { IndexBuyLaunchModal } from './buyLaunch';
import { useContext, useEffect, useState } from 'react';
import { useGlobal } from '@Contexts/Global';
import { useToast } from '@Contexts/Toast';
import { t } from 'i18next';
import BufferInput from '@Views/Common/BufferInput';
import { BlueBtn } from '@Views/Common/V2-Button';
import { Display } from '@Views/Common/Tooltips/Display';
import { toFixed } from '@Utils/NumString';
import { gt, gte } from '@Utils/NumString/stringArithmatics';
import { useGetAllowance, useGetApprovalAmount } from '@Views/Common/Hooks/useAllowanceCall';
import { ViewContext } from '../market';
import { erc20ABI } from 'wagmi';
import { useIndexMarketInteractionCalls } from '../Hooks/useIndexMarketInteractionCalls';

export const IndexMarketModals = ({ data, price }: { data: IMuchoTokenMarketData, price: IIndexPrice }) => {
  const [pageState, setPageState] = useAtom(indexAtom);

  const closeModal = () =>
    setPageState({
      ...pageState,
      isModalOpen: false,
      activeModal: null,
    });
  return (
    <Dialog open={pageState.isModalOpen} onClose={closeModal}>
      <div className="text-1 bg-2 p-6 rounded-md relative">
        <IconButton
          className="!absolute text-1 top-[20px] right-[20px]"
          onClick={closeModal}
        >
          <CloseOutlined />
        </IconButton>
        {pageState.isModalOpen && <ModalChild data={data} price={price} />}
      </div>
    </Dialog>
  );
};

function ModalChild({ data, price }: { data: IMuchoTokenMarketData, price: IIndexPrice }) {
  const [pageState] = useAtom(indexAtom);
  const activeModal = pageState.activeModal;


  if (!activeModal)
    return <div></div>;

  if (pageState.metadata.action == "BUY")
    return <IndexBuyModal data={data} price={price} />;

  if (pageState.metadata.action == "SELL")
    return <IndexSellModal data={data} price={price} />;

}

const useGetQuote = (input: string, depositFee: number, price: number, slippage: number): number[] => {
  //console.log("Calc price", input, depositFee, price, slippage)

  if (!isNaN(+input))
    return [Math.round(10000 * Number(input) * (1 - depositFee) / (price * (1 + slippage))) / 10000];


  return [0];
}

const useGetQuoteSell = (input: string, withdrawFee: number, price: number, slippage: number): number[] => {
  //console.log("Calc price", input, depositFee, price, slippage)

  if (!isNaN(+input))
    return [Math.round(10000 * Number(input) * (1 - withdrawFee) * (price * (1 - slippage))) / 10000];


  return [0];
}

function IndexBuyModal({ data, price }: { data: IMuchoTokenMarketData, price: IIndexPrice }) {
  const [val, setVal] = useState('');
  const [approveState, setApprovalState] = useState(false);
  const { activeChain } = useContext(ViewContext);
  const { state } = useGlobal();
  const toastify = useToast();
  const [quote] = useGetQuote(val, data ? data.depositFeeUser : 0, price ? price.buyPrice : 0, data ? data.slippage : 0);
  const allowance = useGetAllowance(data ? data.buyTokenContract : "", data ? data.buyTokenDecimals : 0, data ? data.contract : "", activeChain.id);
  const { approve } = useGetApprovalAmount(
    erc20ABI,
    data ? data.buyTokenContract : "",
    data ? data.contract : ""
  );
  const { validations, buyCall } = useIndexMarketInteractionCalls(data);
  //console.log("Allowance", allowance, V2USER_CONFIG[activeChain.id]?.MuchoHub.contract);

  const max = data.buyTokenInWallet.toString();
  const isApproved = gte(Number(allowance), val || '1');
  const clickHandler = () => {
    if (validations(val)) return;
    if (gt(val, max))
      return toastify({
        type: 'error',
        msg: 'Amount exceeds balance.',
        id: '007',
      });

    return buyCall(val);
  };


  if (!data || !price)
    return <></>;

  return (
    <div>
      <div>
        <div className="text-f15 mb-5">{t("index.Enter amount in ") + data.buyTokenSymbol}:</div>
        <BufferInput

          header={
            <div className="flex flex-row justify-between w-full text-3 text-f14 mt-2">
              <span className="flex flex-row items-center">
                Max:
                <Display data={max} unit={data.buyTokenSymbol} precision={data.buyTokenDecimals} />
              </span>
            </div>
          }
          numericValidations={{
            decimals: { val: 6 },
            min: { val: '0', error: t("index.Enter a positive value") },
            max: { val: max, error: t("index.Not enough balance") },
          }}
          placeholder="0.0"
          bgClass="!bg-1"
          ipClass="mt-1"
          value={val.toString()}
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
              {data.buyTokenSymbol}
            </span>
          }
        />
        <div className="text-f15">&nbsp;</div>
        <div className="text-f15 mt-5 mb-5">{t("index.Estimated return amount")}:</div>
        <BufferInput
          placeholder="0.0"
          bgClass="!bg-1"
          ipClass="mt-1"
          isDisabled={true}
          value={quote.toString()}
          onChange={() => { }}
          unit={
            <span className="text-f16 flex justify-between w-fit">
              mIndex
            </span>
          }
        />
        <div className="flex whitespace-nowrap mt-5">
          {!isApproved && <BlueBtn
            onClick={() => { approve(toFixed(val * (10 ** data.buyTokenDecimals), 0), setApprovalState) }}
            className="mr-4 rounded"
            isDisabled={isApproved || state.txnLoading > 1}
            isLoading={state.txnLoading === 1 && approveState}

          >
            {t("index.Approve")}
          </BlueBtn>
          }
          {isApproved && <BlueBtn
            onClick={clickHandler}
            className="mr-4 rounded"
            isDisabled={val <= 0 || state.txnLoading > 1 || !isApproved}
            isLoading={state.txnLoading === 1 && !approveState}

          >
            {t("index.Buy")}
          </BlueBtn>
          }
        </div>

        <div className="flex mt-5 text-f14">
          <b>{t("index.Note")}:</b>&nbsp; {t("index.this return amount is an estimation")}
        </div>
        <div className="flex text-f14">
          {t("index.Real returned amount will be calculated when order executes with real time price")}
        </div>
        <div className="flex text-f14">
          {t("index.A buy or sell order can take approximately 10 minutes to be executed.")}
        </div>
      </div>
    </div >
  );
}




function IndexSellModal({ data, price }: { data: IMuchoTokenMarketData, price: IIndexPrice }) {
  const [val, setVal] = useState('');
  const [approveState, setApprovalState] = useState(false);
  const { activeChain } = useContext(ViewContext);
  const { state } = useGlobal();
  const toastify = useToast();
  const [quote] = useGetQuoteSell(val, data ? data.withdrawFeeUser : 0, price ? price.sellPrice : 0, data ? data.slippage : 0);
  const allowance = useGetAllowance(data ? data.mTokenContract : "", data ? data.mTokenDecimals : 0, data ? data.contract : "", activeChain.id);
  const { approve } = useGetApprovalAmount(
    erc20ABI,
    data ? data.mTokenContract : "",
    data ? data.contract : ""
  );
  const { validations, sellCall } = useIndexMarketInteractionCalls(data);
  //console.log("Allowance", allowance, V2USER_CONFIG[activeChain.id]?.MuchoHub.contract);

  const max = data.userBalance.toString();
  const isApproved = gte(Number(allowance), val || '1');
  const clickHandler = () => {
    if (validations(val)) return;
    if (gt(val, max))
      return toastify({
        type: 'error',
        msg: 'Amount exceeds balance.',
        id: '007',
      });

    return sellCall(val);
  };


  if (!data || !price)
    return <></>;

  return (
    <div>
      <div>
        <div className="text-f15 mb-5">{t("index.Enter amount in ")} mIndex:</div>
        <BufferInput

          header={
            <div className="flex flex-row justify-between w-full text-3 text-f14 mt-2">
              <span className="flex flex-row items-center">
                Max:
                <Display data={max} unit="mIndex" precision={data.mTokenDecimals} />
              </span>
            </div>
          }
          numericValidations={{
            decimals: { val: 6 },
            min: { val: '0', error: t("index.Enter a positive value") },
            max: { val: max, error: t("index.Not enough balance") },
          }}
          placeholder="0.0"
          bgClass="!bg-1"
          ipClass="mt-1"
          value={val.toString()}
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
              mIndex
            </span>
          }
        />
        <div className="text-f15">&nbsp;</div>
        <div className="text-f15 mt-5 mb-5">{t("index.Estimated return amount")}:</div>
        <BufferInput
          placeholder="0.0"
          bgClass="!bg-1"
          ipClass="mt-1"
          isDisabled={true}
          value={quote.toString()}
          onChange={() => { }}
          unit={
            <span className="text-f16 flex justify-between w-fit">
              {data.sellTokenSymbol}
            </span>
          }
        />
        <div className="flex whitespace-nowrap mt-5">
          {!isApproved && <BlueBtn
            onClick={() => { approve(toFixed(val * (10 ** data.buyTokenDecimals), 0), setApprovalState) }}
            className="mr-4 rounded"
            isDisabled={isApproved || state.txnLoading > 1}
            isLoading={state.txnLoading === 1 && approveState}

          >
            {t("index.Approve")}
          </BlueBtn>
          }
          {isApproved && <BlueBtn
            onClick={clickHandler}
            className="mr-4 rounded"
            isDisabled={val <= 0 || state.txnLoading > 1 || !isApproved}
            isLoading={state.txnLoading === 1 && !approveState}

          >
            {t("index.Sell")}
          </BlueBtn>
          }
        </div>
        <div className="flex mt-5 text-f14">
          <b>{t("index.Note")}:</b>&nbsp; {t("index.this return amount is an estimation")}
        </div>
        <div className="flex text-f14">
          {t("index.Real returned amount will be calculated when order executes with real time price")}
        </div>
        <div className="flex text-f14">
          {t("index.A buy or sell order can take approximately 10 minutes to be executed.")}
        </div>
      </div>
    </div >
  );
}