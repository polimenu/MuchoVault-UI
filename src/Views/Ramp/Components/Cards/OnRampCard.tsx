//ToDo soft code currency
import { useGlobal } from "@Contexts/Global";
import { Card } from "@Views/Common/Card/Card";
import { TableAligner } from "@Views/Common/TableAligner";
import { Display } from "@Views/Common/Tooltips/Display";
import { addressSummary } from "@Views/Common/Utils";
import { BlueBtn } from "@Views/Common/V2-Button";
import { ICorporate } from "@Views/Ramp/Hooks/corp";
import { networkBeautify, tokenBeautify } from "@Views/Ramp/Utils";
import { IRampTokenPreference, IRampUserDetails, rampAtom, rampDataAtom } from "@Views/Ramp/rampAtom";
import { Skeleton } from "@mui/material";
import { t } from "i18next";
import { useAtom } from "jotai";

export const OnRampCard = ({ tokenPreferences, userDetails, corpDetails }: { tokenPreferences?: IRampTokenPreference[], userDetails?: IRampUserDetails, corpDetails?: ICorporate }) => {
    const wrapperClasses = 'flex justify-end flex-wrap';
    const keyClasses = '!text-f15 !text-2 !text-left !py-[6px] !pl-[0px]';
    const valueClasses = '!text-f15 text-1 !text-right !py-[6px] !pr-[0px]';

    const [rampState, setRampState] = useAtom(rampAtom);
    const [rampData, setRampData] = useAtom(rampDataAtom);
    const { state } = useGlobal();
    const editIconClass = 'w-[1vw] h-[1vw] inline ml-5';
    const headTitle = corpDetails ? corpDetails.legal_name : "";
    const target_address = corpDetails ? corpDetails.target_address : userDetails?.target_address;
    const canTransact = corpDetails ? corpDetails.kybStatus.canTransact : userDetails?.kyc_status.canTransact;
    const targetAddressModalData = corpDetails ? { currentAddress: target_address, uuid: corpDetails.uuid } : { currentAddress: target_address };
    const onRampModalData = corpDetails ? { currency: "EUR", uuid: corpDetails.uuid } : { currency: "EUR" };

    if (!tokenPreferences || !userDetails) {
        return <Skeleton
            key="TokenPreferencesCard"
            variant="rectangular"
            className="w-full !h-full min-h-[370px] !transform-none !bg-1"
        />
    }
    return <Card
        top={(headTitle ? headTitle + " - " : "") + t("ramp.From EUR to Crypto")}
        middle={<TableAligner
            keysName={
                [t("ramp.Target address"), ...tokenPreferences.map(z => t("ramp.Convert currency to", { currency: z.currency }))]
            }
            values={[
                <span className='pointer' onClick={() => { setRampState({ ...rampState, isModalOpen: true, activeModal: "TARGET_ADDRESS", auxModalData: targetAddressModalData }) }}>{target_address ? addressSummary(target_address) : t("ramp.Not set!")}
                    <img src='edit_wh.png' className={editIconClass} />
                </span>
                , ...tokenPreferences.map(t => {
                    const auxData = corpDetails ? { ...t, uuid: corpDetails.uuid } : t;
                    return <span className={`${wrapperClasses} pointer`}
                        onClick={() => { setRampState({ ...rampState, isModalOpen: true, activeModal: "ONRAMP_PREF", auxModalData: auxData }) }}>
                        <Display
                            className="!justify-end"
                            data={tokenBeautify(t.token)}
                        />
                        &nbsp;
                        (<Display
                            className="!justify-end"
                            data={networkBeautify(t.chain)}
                        />)
                        <img src='edit_wh.png' className={editIconClass} />
                    </span>
                })]}
            keyStyle={keyClasses}
            valueStyle={valueClasses}

        />}
        bottom={canTransact && <>
            {target_address && <div className="flex gap-5">
                <BlueBtn
                    isDisabled={state.txnLoading > 1}
                    isLoading={state.txnLoading === 1} onClick={() => { setRampState({ ...rampState, isModalOpen: true, activeModal: "ONRAMP", auxModalData: onRampModalData }) }}>{t("ramp.OnRamp (from EUR to Crypto)")}</BlueBtn>
            </div>}
            {!target_address && <div className="flex gap-5">
                <BlueBtn
                    isDisabled={true} onClick={() => { }}>{t("ramp.Please set a target address")}</BlueBtn>
            </div>}
        </>} />;
}