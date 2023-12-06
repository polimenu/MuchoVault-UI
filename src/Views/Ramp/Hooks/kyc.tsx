import { useGlobal } from "@Contexts/Global";
import { useToast } from "@Contexts/Toast";
import { useEffect, useState } from "react";
import { fetchFromRampApi } from "./fetch";
import { useAtom } from "jotai";
import { ERampStatus, rampAtom, rampDataAtom } from "../rampAtom";
import { t } from "i18next";

export interface IKYCRequest {
    address_line_1: string;
    address_line_2: string;
    post_code: string;
    city: string;
    country: string;
    date_of_birth: string;
    source_of_funds: string;
}


const validateKYCRequest = (request: IKYCRequest): [boolean, string] => {
    if (request.address_line_1.length < 4)
        return [true, t("ramp.Address line 1 is required")];
    if (request.post_code.length < 3)
        return [true, t("ramp.Postal code is required")];
    if (request.city.length < 2)
        return [true, t("ramp.City is required")];
    if (request.country.length !== 2)
        return [true, t("ramp.Country is required")];
    if (request.date_of_birth.length !== 10)
        return [true, t("ramp.Date of birth format is wrong, use YYYY-MM-DD")];
    const [year, month, day] = request.date_of_birth.split("-");
    if (isNaN(year) || year < 1900 || year > (new Date()).getFullYear() - 18)
        return [true, t("ramp.Date of birth format is wrong, use YYYY-MM-DD")];
    if (isNaN(month) || month < 1 || month > 12)
        return [true, t("ramp.Date of birth format is wrong, use YYYY-MM-DD")];
    if (isNaN(day) || day < 1 || day > 31)
        return [true, t("ramp.Date of birth format is wrong, use YYYY-MM-DD")];


    return [false, ""];
}





export const useCreateKYC = (session_id?: string, request?: IKYCRequest) => {
    ///user/target-address
    const { dispatch } = useGlobal();
    const toastify = useToast();
    const [result, setResult] = useState(false);

    const save = (obj: { status: string, errorMessage: string }) => {
        //console.log("Obj res KYC", obj);
        if (obj.status === "OK") {
            //console.log("KYC created ok", obj);
            setResult(true);
            window.location.reload();
        }
        else {
            toastify({ type: "error", msg: t("ramp.Could not create KYC") + (obj.errorMessage ? "" : ": " + obj.errorMessage) });
        }
    }

    useEffect(() => {
        if (request && session_id && request.address_line_1 && request.post_code && request.city && request.country && request.date_of_birth && request.source_of_funds) {
            const [isError, message] = validateKYCRequest(request);
            if (!isError) {
                //console.log("Fetching KYC creation");
                fetchFromRampApi('/kyc', 'POST', { ...request, session_id }, save, dispatch, toastify);
            }
            else {
                toastify({ type: "error", msg: message });
            }
        }
        /*else {
            toastify({ type: "error", msg: "Please fill all fields" });
        }*/
    }, [request]);

    return [result];
}

export const useRampSumsubToken = (getToken: boolean) => {
    const { dispatch } = useGlobal();
    const toastify = useToast();
    const [rampState, setRampState] = useAtom(rampAtom);
    const [rampData] = useAtom(rampDataAtom);
    const session = rampState.sessionId;
    const [sumsubToken, setSumsubToken] = useState('');
    const save = (obj: { status?: string, token?: string, errorMessage?: string }) => {
        //console.log("Saving KYC sumsub token", obj);
        if (!obj.token || obj.status !== "OK") {
            toastify({ type: "error", msg: obj.errorMessage ? obj.errorMessage : t("ramp.KYC token error") });
        }
        else {
            setSumsubToken(obj.token);
            setRampState({ ...rampState, loginStatus: ERampStatus.SUMSUB, sumsubToken: obj.token, email: rampData.userDetails?.email });
            //console.log("Setting sumsub Rampstate", { ...rampState, loginStatus: ERampStatus.SUMSUB, sumsubToken: obj.token, email: rampData.userDetails?.email });
        }
    }

    useEffect(() => {
        if (session && getToken) {
            //console.log("Fetching get KYC sumsub token");
            fetchFromRampApi(`/kyc/token`, 'GET', { session_id: session }, save, dispatch, toastify);
        }
    }, [getToken]);


    return [sumsubToken];
}

