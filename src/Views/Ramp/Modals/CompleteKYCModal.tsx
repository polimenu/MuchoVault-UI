import { useAtom } from "jotai";
import { rampAtom } from "../rampAtom";
import { useState } from "react";
import { useGlobal } from "@Contexts/Global";
import BufferInput from "@Views/Common/BufferInput";
import { t } from "i18next";
import { BlueBtn } from "@Views/Common/V2-Button";
import { IKYCRequest, useCreateKYC } from "../Hooks/kyc";
import { SofDropDown } from "../Components/SofDropDown";
import { CountriesDropDown } from "../Components/CountriesDropDown";

export const CompleteKYCModal = () => {
    const [pageState] = useAtom(rampAtom);
    const [address_line_1, setAddr1] = useState('');
    const [address_line_2, setAddr2] = useState('');
    const [post_code, setPC] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState({ country_code: "ES", country_name: "Spain" });
    const [date_of_birth, setDob] = useState('');
    const [source_of_funds, setSof] = useState('SALARY');
    const [kycReq, setKycReq] = useState<IKYCRequest>();

    const { state } = useGlobal();
    const [isDone] = useCreateKYC(pageState.sessionId, kycReq);
    if (isDone) {
        window.location.reload();
    }
    return (
        <>
            <div className="text-f14">
                <div className="text-f15 mb-5">{t("ramp.Enter your data")}:</div>
                <div className='mt-5'>{t("ramp.Address")}:</div>
                <BufferInput placeholder={"Line 1"} bgClass="!bg-1" ipClass="mt-1" value={address_line_1} onChange={(val) => { setAddr1(val); }} />
                <BufferInput placeholder={"Line 2"} bgClass="!bg-1" ipClass="mt-1" value={address_line_2} onChange={(val) => { setAddr2(val); }} />
                <div className='mt-5'>{t("ramp.Source of funds")}:</div>
                <SofDropDown setSof={setSof} sof={source_of_funds} />
                <div className='mt-5'>{t("ramp.Country")}:</div>
                <CountriesDropDown setCountry={setCountry} country={country} />
                <div className='mt-5'>{t("ramp.Postal Code")}:</div>
                <BufferInput placeholder={"Postal code"} bgClass="!bg-1" ipClass="mt-1" value={post_code} onChange={(val) => { setPC(val); }} />
                <div className='mt-5'>{t("ramp.City")}:</div>
                <BufferInput placeholder={"City"} bgClass="!bg-1" ipClass="mt-1" value={city} onChange={(val) => { setCity(val); }} />
                <div className='mt-5'>{t("ramp.Date of birth")}:</div>
                <BufferInput placeholder={"YYYY-MM-DD"} bgClass="!bg-1" ipClass="mt-1" value={date_of_birth} onChange={(val) => { setDob(val); }} />
            </div>
            <div className="flex whitespace-nowrap mt-5">
                <BlueBtn
                    onClick={() => { setKycReq({ address_line_1, address_line_2, post_code, city, country: country.country_code, date_of_birth, source_of_funds }); }}
                    className="rounded"
                    isDisabled={state.txnLoading > 1}
                    isLoading={state.txnLoading === 1}
                >
                    {t("ramp.Start KYC")}
                </BlueBtn>
            </div>
        </>
    );
}