import { Card } from "@Views/Common/Card/Card";
import { TableAligner } from "@Views/Common/TableAligner";
import { Display } from "@Views/Common/Tooltips/Display";
import { BlueBtn } from "@Views/Common/V2-Button";
import { useLogout } from "@Views/Ramp/Hooks/login";
import { IRampUserDetails, rampAtom } from "@Views/Ramp/rampAtom";
import { Skeleton } from "@mui/material";
import { t } from "i18next";
import { useAtom } from "jotai";

export const UserDetailsCard = ({ userDetails }: { userDetails: IRampUserDetails }) => {
    const [rampState, setRampState] = useAtom(rampAtom);
    const wrapperClasses = 'flex justify-end flex-wrap';
    const keyClasses = '!text-f15 !text-2 !text-left !py-[6px] !pl-[0px]';
    const valueClasses = '!text-f15 text-1 !text-right !py-[6px] !pr-[0px]';

    if (!userDetails) {
        return <Skeleton
            key="userDetailsCard"
            variant="rectangular"
            className="w-full !h-full min-h-[370px] !transform-none !bg-1"
        />
    }

    let parsedAddress = "";
    if (userDetails.address) {
        if (userDetails.address.address_line_1)
            parsedAddress = `${userDetails.address.address_line_1} ${userDetails.address.address_line_2}. ${userDetails.address.post_code} ${userDetails.address.city} (${userDetails.address.country})`;
        else if (userDetails.address.post_code || userDetails.address)
            parsedAddress = `${userDetails.address.post_code} ${userDetails.address.city} (${userDetails.address.country})`;
    }


    return <Card
        top={
            <div className="flex">
                <div className="text-1 text-f16 w-full">{t("ramp.User Details")}</div>
                <div className="text-f12 underline pointer" onClick={() => { useLogout(); }} dangerouslySetInnerHTML={
                    { __html: t("ramp.Logout", { interpolation: { escapeValue: false } }) }
                }></div>
            </div>
        }


        middle={<>{userDetails &&
            <TableAligner
                keysName={
                    // ["Name", "Last name", "E-mail", "Date of birth", "Address", "Postal Code", "City", "Country"]
                    [t("ramp.Name"), t("ramp.E-mail"), t("ramp.Date of birth"), t("ramp.Address"), t("ramp.Corporations"), ""]
                }
                values={[
                    <div className={`${wrapperClasses}`}>
                        <Display
                            className="!justify-end"
                            data={userDetails.first_name + " " + userDetails.last_name}
                        />
                    </div>
                    ,
                    <div className={`${wrapperClasses}`}>
                        <Display
                            className="!justify-end"
                            data={userDetails.email}
                        />
                    </div>
                    ,

                    <div className={`${wrapperClasses}`}>
                        <Display
                            className="!justify-end"
                            data={userDetails.date_of_birth ? userDetails.date_of_birth : ""}
                        />
                    </div>
                    ,

                    <div className={`${wrapperClasses}`}>
                        <Display
                            className="!justify-end"
                            data={parsedAddress}
                        />
                    </div>
                    ,

                    <div className={`${wrapperClasses}`}>
                        <Display
                            className="!justify-end"
                            data={userDetails.linked_corporates_uuid.length > 0 ? "Corporation list" : t("ramp.No Corporations")}
                        />
                    </div>
                    ,

                    <div className={`${wrapperClasses}`}>
                        <BlueBtn onClick={() => { setRampState({ ...rampState, isModalOpen: true, activeModal: "NEWCORP", auxModalData: {} }) }}>{t("ramp.Add Corporation")}</BlueBtn>
                    </div>
                    ,

                ]
                }
                keyStyle={keyClasses}
                valueStyle={valueClasses}
            />}


        </>}

    />;
}