import { useAtom } from "jotai";
import { rampAtom } from "../rampAtom";
import { useState } from "react";
import { useGlobal } from "@Contexts/Global";
import BufferInput from "@Views/Common/BufferInput";
import { t } from "i18next";
import { BlueBtn } from "@Views/Common/V2-Button";
import { useAddAccountB2B } from "../Hooks/corp";

export const BankAddModalB2B = () => {
    const [pageState] = useAtom(rampAtom);
    const [val, setVal] = useState('');
    const [name, setName] = useState('');
    const [account, setAccount] = useState({ name: "", iban: "" });
    const { state } = useGlobal();
    const [isAdded] = useAddAccountB2B(pageState.sessionId, pageState.auxModalData.uuid, account, pageState.auxModalData.currency);
    if (isAdded) {
        window.location.reload();
    }
    return (
        <>
            <div>
                <div className="text-f15 mb-5">{t("ramp.Add bank account for")} {pageState.auxModalData.currency}</div>
                <BufferInput
                    className="mb-5"
                    placeholder={t("ramp.Enter account name")}
                    bgClass="!bg-1"
                    ipClass="mt-1"
                    value={name}
                    onChange={(n) => {
                        setName(n);
                    }}
                />
                <BufferInput
                    placeholder={t("ramp.Enter IBAN")}
                    bgClass="!bg-1"
                    ipClass="mt-1"
                    value={val}
                    onChange={(v) => {
                        setVal(v.replaceAll(" ", ""));
                    }}
                />
            </div>
            <div className="flex whitespace-nowrap mt-5">
                <BlueBtn
                    onClick={() => { setAccount({ iban: val, name: name }); }}
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