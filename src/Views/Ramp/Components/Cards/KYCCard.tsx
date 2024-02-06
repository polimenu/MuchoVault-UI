import { useGlobal } from "@Contexts/Global";
import { Card } from "@Views/Common/Card/Card";
import { TableAligner } from "@Views/Common/TableAligner";
import { Display } from "@Views/Common/Tooltips/Display";
import { BlueBtn } from "@Views/Common/V2-Button";
import { useRampSumsubToken } from "@Views/Ramp/Hooks/kyc";
import { IRampUserDetails, rampAtom } from "@Views/Ramp/rampAtom";
import { Skeleton } from "@mui/material";
import { t } from "i18next";
import { useAtom } from "jotai";
import { useState } from "react";

export const KYCPremiumCard = ({ userDetails }: { userDetails?: IRampUserDetails }) => {
    const keyClasses = '!text-f15 !text-2 !text-left !py-[6px] !pl-[0px]';
    const tooltipKeyClasses = '!text-f14 !text-2 !text-left !py-1 !pl-[0px]';
    const tooltipValueClasses =
        '!text-f14 text-1 !text-right !py-1 !pr-[0px]';
    const underLineClass =
        'underline underline-offset-4 decoration decoration-[#ffffff30]  w-fit ml-auto';
    const wrapperClasses = 'flex justify-end flex-wrap';


    const [rampState, setRampState] = useAtom(rampAtom);
    const [getToken, setGetToken] = useState(false);
    const [token] = useRampSumsubToken(getToken);
    const { state } = useGlobal();

    if (!userDetails) {
        return <Skeleton
            key="userDetailsCard"
            variant="rectangular"
            className="w-full !h-full min-h-[370px] !transform-none !bg-1"
        />
    }

    const toFinishKYC = ["PENDING_KYC_DATA", "SOFT_KYC_FAILED"].indexOf(userDetails?.status) >= 0

    return <Card
        top={
            <>{t("ramp.KYC Status")}: <span
                className={"!justify-end " + (userDetails.status == "FULL_USER" ? " green" : " red")}
            >{t(userDetails.kyc_status.status)}</span></>
        }


        middle={<>
            <div className={keyClasses}>
                <TableAligner
                    keysName={[t("ramp.KYC Status")]}
                    keyStyle={tooltipKeyClasses}
                    valueStyle={tooltipValueClasses}
                    values={[<div className={wrapperClasses}>
                        <Display
                            className={"!justify-end " + underLineClass + " " + (userDetails.status == "FULL_USER" ? " green" : " red")}
                            data={t(userDetails.kyc_status.status)}
                            content={<span>{t(userDetails.kyc_status.explanation)}</span>}
                        />
                    </div>]}
                ></TableAligner>
            </div>
        </>}

        bottom={(userDetails.canCreateKYC || toFinishKYC) && <>
            {userDetails.canCreateKYC && <BlueBtn
                isDisabled={state.txnLoading > 1}
                isLoading={state.txnLoading === 1} onClick={() => { setRampState({ ...rampState, isModalOpen: true, activeModal: "KYC" }) }}>{t("ramp.Start KYC")}</BlueBtn>}
            {toFinishKYC && <>
                <BlueBtn
                    isDisabled={state.txnLoading > 1}
                    isLoading={state.txnLoading === 1} onClick={() => { setRampState({ ...rampState, isModalOpen: true, activeModal: "KYC" }) }}>{t("ramp.Edit user profile")}</BlueBtn>
                &nbsp;<BlueBtn
                    isDisabled={state.txnLoading > 1}
                    isLoading={state.txnLoading === 1} onClick={() => { setGetToken(true); }}>{t("ramp.Finish KYC")}</BlueBtn></>}
        </>}
    />;
}