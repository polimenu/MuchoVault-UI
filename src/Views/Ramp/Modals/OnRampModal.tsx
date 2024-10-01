
import { useAtom } from "jotai";
import { rampAtom, rampDataAtom } from "../rampAtom";
import { useEffect, useState } from "react";
import { useGlobal } from "@Contexts/Global";
import BufferInput from "@Views/Common/BufferInput";
import { t } from "i18next";
import { BlueBtn } from "@Views/Common/V2-Button";
import { networkBeautify, tokenBeautify } from "../Utils";
import { useCreateOnRampAccount, useGetOnRampQuote, useOnRampAccounts } from "../Hooks/onramp";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useToast } from "@Contexts/Toast";


export const OnRampModal = () => {
    const [val, setVal] = useState("");
    const [pageState] = useAtom(rampAtom);
    const [rampData] = useAtom(rampDataAtom);
    const { state } = useGlobal();
    const { currency } = pageState.auxModalData;
    const [trigger, setTrigger] = useState(true);
    const [inputAccount] = useOnRampAccounts(pageState.sessionId, currency, trigger);
    const [visibleAccount, setVisibleAccount] = useState(false);
    const [createdAccount] = useCreateOnRampAccount(pageState.sessionId, currency, Boolean(inputAccount) && !inputAccount?.iban);
    const toastify = useToast();
    const { chain, token } = rampData.tokenPreferences ? rampData.tokenPreferences.find(tp => tp.currency == currency) : { chain: "", token: "" };
    const [quote, discount] = useGetOnRampQuote(pageState.sessionId, currency, token, val);
    const messageCopied = () => {
        toastify(t("ramp.Copied to clipboard!"));
    }

    useEffect(() => {
        if (createdAccount) {
            setTrigger(!trigger);
        }
    }, [createdAccount]);

    if (!rampData.tokenPreferences)
        return <></>;


    return (
        <div>
            <div hidden={visibleAccount}>
                <div className="text-f15 mb-5">{t("ramp.Enter amount currency", { currency: currency })}:</div>
                <BufferInput

                    numericValidations={{
                        decimals: { val: 6 },
                        min: { val: '0', error: t("ramp.Enter a positive value") },
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
                            {currency}
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
                            {tokenBeautify(token)} ({networkBeautify(chain)})
                        </span>
                    }
                />
                {discount && discount > 0 && <div>
                    <div className="whitespace-nowrap mt-5 text-right text-f12">
                        {t("ramp.Standard rate")}: {Math.round(100 * (-Number(discount) + Number(quote))) / 100} {tokenBeautify(token)}
                    </div>
                    <div className="whitespace-nowrap text-right text-f12 bold">
                        {t("ramp.Premium discount applied")}: {discount} {tokenBeautify(token)}
                    </div>
                </div>}
                <div className="flex whitespace-nowrap mt-5">
                    <BlueBtn
                        onClick={() => { setVisibleAccount(true); }}
                        className="mr-4 rounded"
                        isLoading={state.txnLoading === 1}
                        isDisabled={val <= 0}

                    >
                        {t("ramp.Convert to")} {tokenBeautify(token)} ({networkBeautify(chain)})
                    </BlueBtn>
                </div>
            </div>
            <div className="mt-5" hidden={!visibleAccount}>
                {inputAccount && inputAccount.iban && <>
                    <div className="flex mt-5 text-f18 bold">{t("ramp.IMPORTANT NOTE! TRANSFER MUST BE DONE FROM A BANK ACCOUNT WITH SAME NAME AS KYC. Otherwise will be rejected, or funds can be lost.")} </div>
                    <div className="flex whitespace-nowrap mt-5 text-f18 strong">{t("ramp.Next step")}:</div>
                    <div className="flex mt-5 text-f16">{t("ramp.Transfer to the next account and your transaction will be processed shortly.", { amount: val, currency: currency })} </div>
                    <div className="flex mt-5 text-f16">{t("ramp.Note this bank account is a virtual IBAN generated with your name, so the receptor will be yourself, the funds will never be shared with other users.")} </div>
                    <div className="mt-5 ml-5 text-f16">
                        <ul>
                            <OnRampBankField label="Name" value={`${rampData.userDetails?.first_name} ${rampData.userDetails?.last_name}`} messageCopied={messageCopied} />
                            <OnRampBankField label="IBAN" value={inputAccount.iban} messageCopied={messageCopied} />
                            <OnRampBankField label="BIC" value={inputAccount.bic} messageCopied={messageCopied} />
                            <OnRampBankField label={t("ramp.Country")} value={inputAccount.bank_country} messageCopied={messageCopied} />
                        </ul>
                    </div>
                    <div className="flex mt-5 text-f14">
                        {t("ramp.Note we cannot guarantee exact exchange amount, due to fluctuations the stablecoin price may have.")}</div>
                </>}
                {!inputAccount && <>
                    <div className="flex whitespace-nowrap mt-5 text-f18 strong">{t("ramp.No bank account")}</div>
                    <div className="flex mt-5 text-f16">{t("ramp.Sorry, we could not generate a bank account for your onramping. Maybe fiinishing your KYC is needed. Please contact us for more help.")}</div>
                </>}
            </div>
        </div >
    );
}

const OnRampBankField = ({ label, value, messageCopied }: { label: string, value: string, messageCopied: any }) => {
    return <li key={label}>
        <strong>{label}: </strong>
        <span className='green'>{value}</span>
        <CopyToClipboard text={value} onCopy={() => { messageCopied(); }}>
            <img src="/clipboard.png" className='underline pointer w-[1vw] inline ml-5' />
        </CopyToClipboard>
    </li>;
}