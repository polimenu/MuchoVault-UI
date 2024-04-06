import { Card } from "@Views/Common/Card/Card";
import { TableAligner } from "@Views/Common/TableAligner";
import { BlueBtn } from "@Views/Common/V2-Button";
import { IRampAtom, rampAtom } from "@Views/Ramp/rampAtom";
import { Skeleton } from "@mui/material";
import { t } from "i18next";
import { useAtom } from "jotai";
import { SetStateAction } from "react";
import { Display } from "@Views/Common/Tooltips/Display";
import { ICorporate } from "@Views/Ramp/Hooks/corp";



export const KYBCards = ({ corpDetails }: { corpDetails?: ICorporate[] }) => {
    const [rampState, setRampState] = useAtom(rampAtom);

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
    const underLineClass =
        'underline underline-offset-4 decoration decoration-[#ffffff30]  w-fit ml-auto';

    //console.log("corpDetails", corpDetails);

    if (!corpDetails) {
        return <Skeleton
            key="userDetailsCard"
            variant="rectangular"
            className="w-full !h-full min-h-[370px] !transform-none !bg-1"
        />
    }

    //console.log("uuids", userDetails.linked_corporates_uuid);
    //console.log("userDetails", userDetails);

    let parsedAddress = "";
    if (corpDetails.registered_address) {
        if (corpDetails.registered_address.address_line_1)
            parsedAddress = `${corpDetails.registered_address.address_line_1} ${corpDetails.registered_address.address_line_2}. ${corpDetails.registered_address.post_code} ${corpDetails.registered_address.city} (${corpDetails.registered_address.country})`;
        else if (corpDetails.registered_address.post_code || corpDetails.registered_address)
            parsedAddress = `${corpDetails.registered_address.post_code} ${corpDetails.registered_address.city} (${corpDetails.registered_address.country})`;
    }


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
                        t("ramp." + corpDetails.type), corpDetails.registration_number, corpDetails.contact_details.name,
                        corpDetails.contact_details.email, corpDetails.contact_details.phone,
                        parsedAddress, corpDetails.target_address, <Display
                            className={"!justify-end " + underLineClass + " " + (corpDetails.status == "FULL_CORPORATE" ? " green" : " red")}
                            data={t(corpDetails.kybStatus.status)}
                            content={<span>{t(corpDetails.kybStatus.explanation)}</span>}
                        />
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