import { useGlobal } from "@Contexts/Global";
import { useUserAccount } from "@Hooks/useUserAccount";
import { useWriteCall } from "@Hooks/useWriteCall";
import { Card } from "@Views/Common/Card/Card";
import { TableAligner } from "@Views/Common/TableAligner";
import { Display } from "@Views/Common/Tooltips/Display";
import { BlueBtn } from "@Views/Common/V2-Button";
import { RAMP_CONFIG } from "@Views/Ramp/Config/rampConfig";
import { useRampSumsubToken } from "@Views/Ramp/Hooks/kyc";
import { IRampAtom, IRampPremiumInfo, IRampUserDetails, rampAtom } from "@Views/Ramp/rampAtom";
import { Skeleton } from "@mui/material";
import { t } from "i18next";
import { useAtom } from "jotai";
import { SetStateAction, useState } from "react";
import { useNetwork } from "wagmi";
import RampPlanAbi from '../../Config/Abis/mRampPlan.json';
import { useGetCorpDetails } from "@Views/Ramp/Hooks/corp";
import { ICorporate } from "@Views/Ramp/Hooks/user";


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


export const KYBCards = ({ userDetails }: { userDetails?: IRampUserDetails }) => {
    const [rampState, setRampState] = useAtom(rampAtom);
    const [corpDetails] = useGetCorpDetails(rampState.sessionId, userDetails?.linked_corporates_uuid);

    if (!corpDetails || corpDetails.length == 0) {
        return [<></>];
    }

    return corpDetails.map(c => <KYBCard corpDetails={c} rampState={rampState} setRampState={setRampState} />);
}


const KYBCard = ({ corpDetails, rampState, setRampState }: { corpDetails: ICorporate, rampState: IRampAtom, setRampState: (update: SetStateAction<IRampAtom>) => void }) => {
    const keyClasses = '!text-f15 !text-2 !text-left !py-[6px] !pl-[0px]';
    const tooltipKeyClasses = '!text-f14 !text-2 !text-left !py-1 !pl-[0px]';
    const tooltipValueClasses =
        '!text-f14 text-1 !text-right !py-1 !pr-[0px]';

    console.log("corpDetails", corpDetails);

    if (!corpDetails) {
        return <Skeleton
            key="userDetailsCard"
            variant="rectangular"
            className="w-full !h-full min-h-[370px] !transform-none !bg-1"
        />
    }

    //console.log("uuids", userDetails.linked_corporates_uuid);
    //console.log("userDetails", userDetails);
    /*

    */

    let parsedAddress = "";
    if (corpDetails.registered_address) {
        if (corpDetails.registered_address.address_line_1)
            parsedAddress = `${corpDetails.registered_address.address_line_1} ${corpDetails.registered_address.address_line_2}. ${corpDetails.registered_address.post_code} ${corpDetails.registered_address.city} (${corpDetails.registered_address.country})`;
        else if (corpDetails.registered_address.post_code || corpDetails.registered_address)
            parsedAddress = `${corpDetails.registered_address.post_code} ${corpDetails.registered_address.city} (${corpDetails.registered_address.country})`;
    }

    /*
    <div><BlueBtn onClick={() => { setRampState({ ...rampState, isModalOpen: true, activeModal: "NEWCORP", auxModalData: {} }) }}>&nbsp;&nbsp;&nbsp;
                <span dangerouslySetInnerHTML={
                    { __html: t("ramp.Add", { interpolation: { escapeValue: false } }) }
                }></span>&nbsp;&nbsp;&nbsp;</BlueBtn></div>
    */

    return <Card
        top={

            <div className='flex'>
                <div className='w-full'>{corpDetails.legal_name}</div>
            </div>
        }

        middle={<>
            <div className={keyClasses}>
                <TableAligner
                    keysName={[t("ramp.Type"), t("ramp.Registration Number"), t("ramp.Contact Name")
                        , t("ramp.Contact E-mail"), t("ramp.Contact Phone")
                        , t("ramp.Address"), t("ramp.Target Address"), t("ramp.KYB Status")]}
                    keyStyle={tooltipKeyClasses}
                    valueStyle={tooltipValueClasses}
                    values={[
                        corpDetails.type, corpDetails.registration_number, corpDetails.contact_details.name,
                        corpDetails.contact_details.name, corpDetails.contact_details.phone,
                        parsedAddress, corpDetails.target_address, corpDetails.status
                    ]}
                ></TableAligner>
            </div>
        </>}

        bottom={
            <div className="flex">
                <BlueBtn onClick={() => { setRampState({ ...rampState, isModalOpen: true, activeModal: "EDITCORP", auxModalData: { uuid: corpDetails.uuid } }) }}>Edit details</BlueBtn> &nbsp;&nbsp;&nbsp;&nbsp;
                {corpDetails.kybUrl && <BlueBtn onClick={() => { window.open(corpDetails.kybUrl) }}>Fill KYB Form</BlueBtn>}
            </div>
        }
    />;
}