
import { useAtom } from "jotai";
import { rampAtom } from "../rampAtom";
import { useState } from "react";
import { useGlobal } from "@Contexts/Global";
import BufferInput from "@Views/Common/BufferInput";
import { t } from "i18next";
import { BlueBtn } from "@Views/Common/V2-Button";
import { Display } from "@Views/Common/Tooltips/Display";
import { RAMP_CONFIG } from "../Config/rampConfig";
import { useGetAmountInWallet, useGetOffRampQuote, useOffRampWallet, useSendToken } from "../Hooks/offramp";
import { useActiveChain } from "@Hooks/useActiveChain";
import { OfframpTokensDropDown } from "../Utils/OffRampTokensDropDown";


//ToDo softcode chain
export const OffRampModal = () => {
    const [rampState] = useAtom(rampAtom);
    const [val, setVal] = useState("");
    const { state } = useGlobal();
    const currency = RAMP_CONFIG.AllowedFiatCurrencies[0];
    const tokenList = RAMP_CONFIG.AllowedOffRampTokens;
    const [token, setToken] = useState(tokenList[0]);
    const [quote] = useGetOffRampQuote(token.symbol, currency, val);
    const { activeChain } = useActiveChain();
    const chain = activeChain.network;
    const [destinationWallet] = useOffRampWallet(rampState.sessionId, chain);
    const [max] = useGetAmountInWallet(token.address, token.decimals);
    const [send] = useSendToken(token.address, destinationWallet, val, token.decimals);


    return (
        <div>
            <div>
                <div className="text-f15 mb-5">{t("ramp.Enter amount")}:</div>
                <BufferInput
                    header={
                        <div className="flex flex-row justify-between w-full text-3 text-f14 mt-2">
                            <span className="flex flex-row items-center">
                                Max:
                                <Display data={max} unit={token.symbol} precision={2} />
                            </span>
                        </div>
                    }
                    numericValidations={{
                        decimals: { val: 6 },
                        max: {
                            val: max.toString(),
                            error: t('v2.Not enough funds'),
                        },
                        min: { val: '0', error: t('v2.Enter a positive value') },
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
                            <OfframpTokensDropDown token={token} setToken={setToken} tokenList={tokenList} />
                        </span>
                    }
                />
                <div className="text-f15">&nbsp;</div>
                <div className="text-f15 mt-5 mb-5">{t("ramp.Estimated return amount")}:</div>
                <BufferInput
                    placeholder="0.0"
                    bgClass="!bg-1"
                    ipClass="mt-1"
                    isDisabled={true}
                    value={quote}
                    onChange={() => { }}
                    unit={
                        <span className="text-f16 flex justify-between w-fit">
                            {currency}
                        </span>
                    }
                />
                <div className="flex whitespace-nowrap mt-5">
                    <BlueBtn
                        onClick={() => { send() }}
                        className="mr-4 rounded"
                        isLoading={state.txnLoading === 1}

                    >
                        {t("ramp.Convert to")} {currency}
                    </BlueBtn>
                </div>
            </div>
        </div >
    );
}