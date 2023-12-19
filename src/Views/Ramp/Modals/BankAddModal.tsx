import { useAtom } from "jotai";
import { rampAtom, rampDataAtom } from "../rampAtom";
import { useState } from "react";
import { useGlobal } from "@Contexts/Global";
import { useAddAccount } from "../Hooks/user";
import BufferInput from "@Views/Common/BufferInput";
import { t } from "i18next";
import { BlueBtn } from "@Views/Common/V2-Button";

export const BankAddModal = () => {
    const [pageState] = useAtom(rampAtom);
    const [rampData] = useAtom(rampDataAtom);
    const [val, setVal] = useState('');
    const [account, setAccount] = useState('');
    const { state } = useGlobal();
    const [isAdded] = useAddAccount(pageState.sessionId, account, pageState.auxModalData.currency);
    if (isAdded) {
        window.location.reload();
    }
    return (
        <>
            <div>
                <div className="text-f15 mb-5">{t("ramp.Add bank account for")} {pageState.auxModalData.currency}</div>
                <BufferInput
                    placeholder={t("ramp.Enter IBAN")}
                    bgClass="!bg-1"
                    ipClass="mt-1"
                    value={val}
                    onChange={(val) => {
                        setVal(val.replaceAll(" ", ""));
                    }}
                />
            </div>
            <div className="flex whitespace-nowrap mt-5">
                <BlueBtn
                    onClick={() => { setAccount(val); }}
                    className="rounded"
                    isDisabled={state.txnLoading > 1}
                    isLoading={state.txnLoading === 1}
                >
                    {t("ramp.Add account")}
                </BlueBtn>
            </div>
        </>
    );
}