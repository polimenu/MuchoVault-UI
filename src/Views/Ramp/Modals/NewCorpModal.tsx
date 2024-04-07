
import { useState } from "react";
import { useGlobal } from "@Contexts/Global";
import BufferInput from "@Views/Common/BufferInput";
import { t } from "i18next";
import { BlueBtn } from "@Views/Common/V2-Button";
import { CountriesDropDown } from "../Components/CountriesDropDown";
import { INewCorporateRequest } from "../Hooks/user";
import { useCreateCorp } from "../Hooks/corp";
import { CorpTypeDropDown } from "../Components/CorpTypeDropDown";
import { useAtom } from "jotai";
import { rampDataAtom } from "../rampAtom";

export const NewCorpModal = () => {
    const [legalName, setLegalName] = useState('');
    const [contactName, setContactName] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [registrationNumber, setRegistrationNumber] = useState('');
    const [req, setReq] = useState<INewCorporateRequest>();
    const [post_code, setPC] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState({ country_code: "ES", country_name: "Spain" });
    const [address_line_1, setAddr1] = useState('');
    const [address_line_2, setAddr2] = useState('');
    const [targetAddress, setTargetAddress] = useState('');
    const [corpType, setCorpType] = useState('LIMITED_LIABILITY');

    const { state } = useGlobal();
    const [isDone] = useCreateCorp(req);
    const [rampData] = useAtom(rampDataAtom);


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
                <CorpTypeDropDown setCorpType={setCorpType} corpType={corpType} />
                <div className='mt-5'>{t("ramp.Registration number")}:</div>
                <BufferInput placeholder={t("ramp.Registration number")} bgClass="!bg-1" ipClass="mt-1" value={registrationNumber} onChange={(val) => { setRegistrationNumber(val); }} />

                <div className='mt-5'>{t("ramp.Contact Name")} ({t("ramp.Contact Name Explanation")}):</div>
                <BufferInput placeholder={t("ramp.Contact Name")} bgClass="!bg-1" ipClass="mt-1" value={contactName} onChange={(val) => { setContactName(val); }} />
                <div className='mt-5'>{t("ramp.Contact E-mail")} ({t("ramp.Contact Email Explanation")}):</div>
                <BufferInput placeholder={t("ramp.Contact E-mail")} bgClass="!bg-1" ipClass="mt-1" value={contactEmail} onChange={(val) => { setContactEmail(val); }} />
                <div className='mt-5'>{t("ramp.Contact Phone")} ({t("ramp.Contact Phone Explanation")}):</div>
                <BufferInput placeholder={t("ramp.Contact Phone")} bgClass="!bg-1" ipClass="mt-1" value={contactPhone} onChange={(val) => { setContactPhone(val); }} />

                <div className='mt-5'>{t("ramp.Address")}:</div>
                <BufferInput placeholder={"Line 1"} bgClass="!bg-1" ipClass="mt-1" value={address_line_1} onChange={(val) => { setAddr1(val); }} />
                <BufferInput placeholder={"Line 2"} bgClass="!bg-1" ipClass="mt-1" value={address_line_2} onChange={(val) => { setAddr2(val); }} />
                <div className='mt-5'>{t("ramp.Country")}:</div>
                <CountriesDropDown setCountry={setCountry} country={country} />
                <div className='mt-5'>{t("ramp.Postal Code")}:</div>
                <BufferInput placeholder={"Postal code"} bgClass="!bg-1" ipClass="mt-1" value={post_code} onChange={(val) => { setPC(val); }} />
                <div className='mt-5'>{t("ramp.City")}:</div>
                <BufferInput placeholder={"City"} bgClass="!bg-1" ipClass="mt-1" value={city} onChange={(val) => { setCity(val); }} />

                <div className='mt-5'>{t("ramp.Target Address")}:</div>
                <BufferInput placeholder={"0x"} bgClass="!bg-1" ipClass="mt-1" value={targetAddress} onChange={(val) => { setTargetAddress(val); }} />


            </div>
            <div className="flex whitespace-nowrap mt-5">
                <BlueBtn
                    onClick={() => {
                        setReq({
                            legal_name: legalName,
                            type: corpType,
                            registration_number: registrationNumber,
                            contact_details: {
                                name: contactName,
                                email: contactEmail,
                                phone: contactPhone
                            },
                            registered_address: {
                                address_line_1,
                                address_line_2,
                                post_code,
                                city,
                                country: country.country_code
                            },
                            target_address: targetAddress,
                            user_uuid: rampData.userDetails?.uuid
                        });
                    }}
                    className="rounded"
                    isDisabled={state.txnLoading > 1}
                    isLoading={state.txnLoading === 1}
                >
                    {t("ramp.New Corporation")}
                </BlueBtn>
            </div>
        </>
    );
}