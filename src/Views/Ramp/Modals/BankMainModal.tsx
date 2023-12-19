import { useAtom } from "jotai";
import { rampAtom } from "../rampAtom";
import { useState } from "react";
import { useGlobal } from "@Contexts/Global";
import { t } from "i18next";
import { BlueBtn } from "@Views/Common/V2-Button";
import { useSetMainBankAccount } from "../Hooks/user";
import { useToast } from "@Contexts/Toast";


export const BankMainModal = () => {
    const [pageState] = useAtom(rampAtom);
    const [update, setUpdate] = useState(false);
    const toastify = useToast();
    const [result] = useSetMainBankAccount(pageState.sessionId, pageState.auxModalData.uuid, update)
    const { state } = useGlobal();

    if (result.done && result.status) {
        toastify(t("ramp.Main bank account updated successfully"));
        window.location.reload();
        return <></>;
    }
    else if (result.done) {
        toastify({ type: "error", message: result.errorMessage })
        return <></>;
    }
    return (
        <>
            <div className="text-f14">
                <div className="text-f15 mb-5">IBAN:</div>
                <div className='mt-5'>{pageState.auxModalData.iban}</div>
            </div>
            <div className="flex whitespace-nowrap mt-5">
                <BlueBtn
                    onClick={() => { setUpdate(true); }}
                    className="rounded"
                    isDisabled={state.txnLoading > 1}
                    isLoading={state.txnLoading === 1}
                >
                    {t("ramp.Set as main account")}
                </BlueBtn>
            </div>
        </>
    );
}