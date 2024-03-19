
import { useState } from "react";
import { useGlobal } from "@Contexts/Global";
import BufferInput from "@Views/Common/BufferInput";
import { t } from "i18next";
import { BlueBtn } from "@Views/Common/V2-Button";
import { CountriesDropDown } from "../Components/CountriesDropDown";
import { INewUserRequest, useCreateUser } from "../Hooks/user";

export const NewCorpModal = () => {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [req, setReq] = useState<INewUserRequest>();
    const [country, setCountry] = useState({ country_code: "ES", country_name: "Spain" });

    const { state } = useGlobal();
    const [isDone] = useCreateUser(req);


    if (isDone) {
        window.location.reload();
    }
    return (
        <>
            <div className="text-f14">
                <div className="text-f15 mb-5">{t("ramp.Enter corporation data")}:</div>
                <div className='mt-5'>{t("ramp.Legal Name")}:</div>
                <BufferInput placeholder={t("ramp.Legal Name")} bgClass="!bg-1" ipClass="mt-1" value={legalName} onChange={(val) => { setLegalName(val); }} />
                <div className='mt-5'>{t("ramp.Corporation Type")}:</div>
                <CountriesDropDown setCountry={setCountry} country={country} />
                <div className='mt-5'>{t("ramp.Registration number")}:</div>
                <BufferInput placeholder={t("ramp.Registration number")} bgClass="!bg-1" ipClass="mt-1" value={registrationNumber} onChange={(val) => { setRegistrationNumber(val); }} />
                <div className='mt-5'>{t("ramp.Last Name")} ({t("ramp.Last Name Explanation")}):</div>
                <BufferInput placeholder={t("ramp.Last Name")} bgClass="!bg-1" ipClass="mt-1" value={lastName} onChange={(val) => { setLastName(val); }} />


            </div>
            <div className="flex whitespace-nowrap mt-5">
                <BlueBtn
                    onClick={() => { setReq({ email, first_name: firstName, last_name: lastName, country: country.country_code }); }}
                    className="rounded"
                    isDisabled={state.txnLoading > 1}
                    isLoading={state.txnLoading === 1}
                >
                    {t("ramp.New User")}
                </BlueBtn>
            </div>
        </>
    );
}