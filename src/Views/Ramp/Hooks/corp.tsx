import { useGlobal } from "@Contexts/Global";
import { ICorporate, INewCorporateRequest } from "./user";
import { useToast } from "@Contexts/Toast";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { IRampTokenPreferencesB2B, IRampTransaction, rampAtom } from "../rampAtom";
import { t } from "i18next";
import { fetchFromRampApi } from "./fetch";
import { RAMP_CONFIG } from "../Config/rampConfig";



export const useGetCorpDetails = (sessionId: string, corporationUuids: string[]): ICorporate[][] => {
    const [corpsDetails, setCorpsDetails] = useState<ICorporate[]>([]);

    const save = (obj: any) => {
        //console.log("****************setting GET CORPORATES", obj);
        if (obj.status !== "KO") {
            setCorpsDetails(obj.response);
        }
    }

    useEffect(() => {
        //console.log("CALLING GET CORPORATES", sessionId, corporationUuids);

        if (sessionId && corporationUuids && corporationUuids.length > 0) {
            fetchFromRampApi(`/corporates`, 'GET', { uuids: corporationUuids.join(","), session_id: sessionId }, save, () => { });
        }

    }, [sessionId, corporationUuids ? corporationUuids.join(",") : ""]);

    return [corpsDetails];
}

export const useCreateCorp = (request?: INewCorporateRequest) => {
    ///user/target-address
    const { dispatch } = useGlobal();
    const toastify = useToast();
    const [result, setResult] = useState(false);
    const [rampState, setRampState] = useAtom(rampAtom);

    const save = (obj: { status: string, errorMessage: string }) => {
        //console.log("Obj res create user", obj);
        if (obj.status === "OK") {
            //console.log("User created ok", obj);
            setResult(true);
            //window.location.reload();
            toastify(t("ramp.Corporation successfully created"));
        }
        else {
            toastify({ type: "error", msg: (obj.errorMessage ? obj.errorMessage : t("ramp.Could not create Corporation")) });
        }
    }

    useEffect(() => {
        if (request && request.legal_name && request.type && request.contact_details && request.registered_address && request.target_address) {

            //console.log("Fetching Corp creation");
            fetchFromRampApi('/corporate', 'POST', request, save, dispatch, toastify);

        }
    }, [request]);

    return [result];
}

export const useEditCorp = (uuid: string, session_id: string, request?: INewCorporateRequest) => {
    ///user/target-address
    const { dispatch } = useGlobal();
    const toastify = useToast();
    const [result, setResult] = useState(false);
    const [rampState, setRampState] = useAtom(rampAtom);

    const save = (obj: { status: string, errorMessage: string }) => {
        //console.log("Obj res create user", obj);
        if (obj.status === "OK") {
            //console.log("User created ok", obj);
            setResult(true);
            //window.location.reload();
            toastify(t("ramp.Corporation successfully saved"));
        }
        else {
            toastify({ type: "error", msg: (obj.errorMessage ? obj.errorMessage : t("ramp.Could not save Corporation")) });
        }
    }

    useEffect(() => {
        if (uuid && request && request.legal_name && request.type && request.contact_details && request.registered_address && request.target_address) {

            //console.log("Fetching Corp creation");
            fetchFromRampApi('/corporate', 'PATCH', { corporate: request, uuid, session_id }, save, dispatch, toastify);

        }
    }, [request, uuid, session_id]);

    return [result];
}



export const useGetRampTransactionsB2B = (sessionId: string, uuids: string[]): ({ uuid: string, transactions: IRampTransaction[] }[] | undefined)[] => {
    const [transactions, setTransactions] = useState<{ uuid: string, transactions: IRampTransaction[] }[]>();
    const save = (obj: { status: string, corps: { uuid: string, transactions: IRampTransaction[] }[] }) => {
        //console.log("setting transactions", obj);
        setTransactions(obj.corps);
    }

    useEffect(() => {
        if (!sessionId || !uuids || uuids.length == 0)
            save([]);
        else {
            const call = () => {
                //console.log("CALLING GET TRANSACTIONS");
                fetchFromRampApi(`/corporate/transactions`, 'GET', { session_id: sessionId, uuids: uuids.join(",") }, save, () => { });
            }
            call();
            const interval = setInterval(() => call(), RAMP_CONFIG.DelayTransactionsRefreshSeconds * 1000);
            return () => {
                clearInterval(interval);
            }
        }
    }, [sessionId, uuids ? uuids.join(",") : ""]);

    return [transactions];
}


export const useGetTokenPreferencesB2B = (sessionId?: string): (IRampTokenPreferencesB2B[] | undefined)[] => {
    const { dispatch } = useGlobal();
    const [userTPs, setUserTPs] = useState<IRampTokenPreferencesB2B[]>();
    const save = (obj: { response: IRampTokenPreferencesB2B[] }) => {
        //console.log("setting user token preferences b2b", obj);
        const res = obj.map(corp => {
            return {
                ...corp,
                tokenPreferences: corp.tokenPreferences.filter(t => RAMP_CONFIG.AllowedFiatCurrencies.indexOf(t.currency) >= 0)
            }
        })
        //console.log("setting user token preferences b2b FILTERED", res);
        setUserTPs(res);
    }

    useEffect(() => {
        if (sessionId) {
            console.log("FETCHING user token preferences b2b");
            fetchFromRampApi(`/corporate/token-preferences`, 'GET', { session_id: sessionId }, save, dispatch);
        }
    }, [sessionId]);

    return [userTPs];
}