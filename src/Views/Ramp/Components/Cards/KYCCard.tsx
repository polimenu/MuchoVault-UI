import { useGlobal } from "@Contexts/Global";
import { useUserAccount } from "@Hooks/useUserAccount";
import { useWriteCall } from "@Hooks/useWriteCall";
import { Card } from "@Views/Common/Card/Card";
import { TableAligner } from "@Views/Common/TableAligner";
import { Display } from "@Views/Common/Tooltips/Display";
import { BlueBtn } from "@Views/Common/V2-Button";
import { RAMP_CONFIG } from "@Views/Ramp/Config/rampConfig";
import { useRampSumsubToken } from "@Views/Ramp/Hooks/kyc";
import { IRampPremiumInfo, IRampUserDetails, rampAtom } from "@Views/Ramp/rampAtom";
import { Skeleton } from "@mui/material";
import { t } from "i18next";
import { useAtom } from "jotai";
import { useState } from "react";
import { useNetwork } from "wagmi";
import RampPlanAbi from '../../Config/Abis/mRampPlan.json';


const getContractCall = (setPageState: any, writeCall: any, functionName: string, args: any[]) => {
    function callBack(res) {
        if (res.payload)
            setPageState({
                isModalOpen: false,
                activeModal: null,
            });
    }

    function myCall() {
        writeCall(callBack, functionName, args);
    }

    return myCall;
};


export const KYCPremiumCard = ({ userDetails, premiumInfo }: { userDetails?: IRampUserDetails, premiumInfo?: IRampPremiumInfo }) => {
    const keyClasses = '!text-f15 !text-2 !text-left !py-[6px] !pl-[0px]';
    const tooltipKeyClasses = '!text-f14 !text-2 !text-left !py-1 !pl-[0px]';
    const tooltipValueClasses =
        '!text-f14 text-1 !text-right !py-1 !pr-[0px]';
    const underLineClass =
        'underline underline-offset-4 decoration decoration-[#ffffff30]  w-fit ml-auto';
    const wrapperClasses = 'flex justify-end flex-wrap';
    const noteStyles = 'w-[46rem] text-center m-auto tab:w-full font-weight:bold text-f16 mt-5 text-1';


    const [rampState, setRampState] = useAtom(rampAtom);
    const [getToken, setGetToken] = useState(false);
    const { state } = useGlobal();
    const { address: account } = useUserAccount();
    const { chain } = useNetwork();
    const ALLOWED_CHAIN = 42161;  //ToDo softcode chain
    const { writeCall } = useWriteCall(RAMP_CONFIG.RampPlanContract, RampPlanAbi);
    const linkPremiumCall = getContractCall(setRampState, writeCall, "assignMe", [userDetails?.uuid]);

    if (!userDetails) {
        return <Skeleton
            key="userDetailsCard"
            variant="rectangular"
            className="w-full !h-full min-h-[370px] !transform-none !bg-1"
        />
    }

    const toFinishKYC = ["PENDING_KYC_DATA", "SOFT_KYC_FAILED"].indexOf(userDetails?.status) >= 0


    let premiumStatus = "Normal";
    if (premiumInfo && premiumInfo?.isPremium && userDetails.isPremium) {
        premiumStatus = "Premium";
    }
    else if (premiumInfo && premiumInfo?.isPremium) {
        premiumStatus = "PremiumPending";
    }

    return <Card
        top={
            <>{t("ramp.User Status")}</>
        }

        middle={<>
            <div className={keyClasses}>
                <TableAligner
                    keysName={[t("ramp.KYC Status"), t("ramp.Plan")]}
                    keyStyle={tooltipKeyClasses}
                    valueStyle={tooltipValueClasses}
                    values={[<div className={wrapperClasses}>
                        <Display
                            className={"!justify-end " + underLineClass + " " + (userDetails.status == "FULL_USER" ? " green" : " red")}
                            data={t(userDetails.kyc_status.status)}
                            content={<span>{t(userDetails.kyc_status.explanation)}</span>}
                        />
                    </div>,
                    <div className={wrapperClasses}>
                        <Display
                            className={"!justify-end " + underLineClass + " " + (premiumStatus == "Premium" ? " green" : "")}
                            data={t("ramp." + premiumStatus)}
                            content={<span>{t("ramp." + premiumStatus + "Explanation")}</span>}
                        />
                    </div>]}
                ></TableAligner>
                {premiumInfo && !premiumInfo?.isPremium && account && chain && chain.id == ALLOWED_CHAIN && <div className={noteStyles}>
                    <div className="mb-5">
                        {t("ramp.Already have your NFT?")}
                    </div>
                    <div>
                        <BlueBtn
                            isDisabled={state.txnLoading > 1}
                            isLoading={state.txnLoading === 1} onClick={linkPremiumCall}>{t("ramp.Enable Your Premium Mode")}</BlueBtn>
                    </div>
                </div>}
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