import { useGlobal } from "@Contexts/Global";
import { Card } from "@Views/Common/Card/Card";
import { TableAligner } from "@Views/Common/TableAligner";
import { Display } from "@Views/Common/Tooltips/Display";
import { BlueBtn } from "@Views/Common/V2-Button";
import { useLogout } from "@Views/Ramp/Hooks/login";
import { IRampUserDetails, rampAtom } from "@Views/Ramp/rampAtom";
import { Skeleton } from "@mui/material";
import { t } from "i18next";
import { useAtom } from "jotai";

export const UserDetailsCard = ({ userDetails, addCorpButton = false }: { userDetails: IRampUserDetails, addCorpButton: boolean }) => {
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

    const toFinishKYC = ["PENDING_KYC_DATA", "SOFT_KYC_FAILED"].indexOf(userDetails?.status) >= 0

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
                    [t("ramp.Name"), t("ramp.E-mail"), t("ramp.Date of birth"), t("ramp.Address")]
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

                ]
                }
                keyStyle={keyClasses}
                valueStyle={valueClasses}
            />}



        </>}

        bottom={<UserDetailsButtons addCorpButton={addCorpButton} canCreateKYC={userDetails.canCreateKYC} toFinishKYC={toFinishKYC} />}
    />;
}

const UserDetailsButtons = ({ addCorpButton, canCreateKYC, toFinishKYC }: { addCorpButton: boolean, canCreateKYC: boolean, toFinishKYC: boolean }) => {
    const [rampState, setRampState] = useAtom(rampAtom);
    const { state } = useGlobal();
    return <div>
        {canCreateKYC && <BlueBtn
            isDisabled={state.txnLoading > 1}
            isLoading={state.txnLoading === 1} onClick={() => { setRampState({ ...rampState, isModalOpen: true, activeModal: "KYC" }) }}>{t("ramp.Start KYC")}
        </BlueBtn>}

        {toFinishKYC && <BlueBtn
            isDisabled={state.txnLoading > 1}
            isLoading={state.txnLoading === 1} onClick={() => { setRampState({ ...rampState, isModalOpen: true, activeModal: "KYC" }) }}>{t("ramp.Edit user profile")}
        </BlueBtn>}

        {addCorpButton && <BlueBtn onClick={() => { setRampState({ ...rampState, isModalOpen: true, activeModal: "NEWCORP", auxModalData: {} }) }}>&nbsp;&nbsp;&nbsp;
            <span dangerouslySetInnerHTML={
                { __html: t("ramp.Add Corporation", { interpolation: { escapeValue: false } }) }
            }></span>&nbsp;&nbsp;&nbsp;</BlueBtn>}

    </div>;
}