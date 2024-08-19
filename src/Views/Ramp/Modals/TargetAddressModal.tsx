import { useAtom } from "jotai";
import { rampAtom, rampDataAtom } from "../rampAtom";
import { useState } from "react";
import { useGlobal } from "@Contexts/Global";
import { usePatchAddress, usePatchSolanaAddress } from "../Hooks/user";
import BufferInput from "@Views/Common/BufferInput";
import { BlueBtn } from "@Views/Common/V2-Button";
import { t } from "i18next";
import { usePatchAddressB2B, usePatchSolanaAddressB2B } from "../Hooks/corp";

export const TargetAddressModal = () => {
    const [pageState] = useAtom(rampAtom);
    const [rampData] = useAtom(rampDataAtom);
    const currentAddress = pageState.auxModalData && pageState.auxModalData.currentAddress ? pageState.auxModalData.currentAddress : "";
    const [val, setVal] = useState(currentAddress);
    const [addr, setAddr] = useState('');
    const { state } = useGlobal();
    const isB2B = Boolean(pageState.auxModalData.uuid);
    const ALLOWED_CURRENCY = "EUR" //ToDo multicurrency
    const tokenPrefs = isB2B ? rampData.tokenPreferencesB2B.find(t => t.corporateUuid == pageState.auxModalData.uuid)?.tokenPreferences : rampData.tokenPreferences;
    const tokenPref = tokenPrefs.find(t => t.currency == ALLOWED_CURRENCY);
    const isSolana = (tokenPref?.chain == "solana")
    const [isPatched] = isB2B ?
        (!isSolana ? usePatchAddressB2B(pageState.sessionId, pageState.auxModalData.uuid, addr) : usePatchSolanaAddressB2B(pageState.sessionId, pageState.auxModalData.uuid, addr)) :
        (!isSolana ? usePatchAddress(pageState.sessionId, addr) : usePatchSolanaAddress(pageState.sessionId, addr));
    if (isPatched) {
        window.location.reload();
    }
    return (
        <>
            <div>
                <div className="text-f15 mb-5">{t("ramp.Change target address")}</div>
                <BufferInput
                    placeholder={t("ramp.Enter your new address")}
                    bgClass="!bg-1"
                    ipClass="mt-1"
                    value={val}
                    onChange={(val) => {
                        setVal(val);
                    }}
                />
            </div>
            <div className="flex whitespace-nowrap mt-5">
                <BlueBtn
                    onClick={() => { setAddr(val); }}
                    className="rounded"
                    isDisabled={state.txnLoading > 1}
                    isLoading={state.txnLoading === 1}
                >
                    {t("ramp.Change address")}
                </BlueBtn>
            </div>
        </>
    );
}