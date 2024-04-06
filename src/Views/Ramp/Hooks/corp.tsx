import { useGlobal } from "@Contexts/Global";
import { IAddress, IContactDetails } from "./user";
import { useToast } from "@Contexts/Toast";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { IRampBankAccount, IRampTokenPreferencesB2B, IRampTransaction, rampAtom } from "../rampAtom";
import { t } from "i18next";
import { fetchFromRampApi } from "./fetch";
import { RAMP_CONFIG } from "../Config/rampConfig";

export interface INewCorporateRequest {
    legal_name: string;
    type: string;
    registration_number: string;
    contact_details: IContactDetails;
    registered_address: IAddress;
    target_address: string;
    user_uuid: string;
}

export interface ICorporate {
    uuid: string;
    legal_name: string;
    type: string;
    registration_number: string;
    contact_details: IContactDetails;
    registered_address: IAddress;
    target_address: string;
    status: string;
    kybUrl: string;
    kybStatus: { status: string, explanation: string, canTransact: boolean };
}

const kybStatus = (corpStatus: string): { status: string, explanation: string, canTransact: boolean } => {
    switch (corpStatus) {
        case "CREATED":
            return { status: ("ramp.Pending"), explanation: ("ramp.You are only allowed to make 1 transaction, for less than 700€"), canTransact: true }
        case "KYB_NEEDED":
            return { status: ("ramp.Pending"), explanation: ("ramp.No transactions allowed. You need to finish your KYB."), canTransact: false }
        case "PENDING_KYB_DATA":
            return { status: ("ramp.Pending to receive KYB data"), explanation: ("ramp.No transactions allowed. Please finish your KYB."), canTransact: false }
        case "KYB_PENDING":
            return { status: ("ramp.Verification in progress"), explanation: ("ramp.No transactions allowed. Please wait until KYB revision is ended."), canTransact: false }
        case "SOFT_KYB_FAILED":
            return { status: ("ramp.Failed"), explanation: ("ramp.No transactions allowed. You can retry your KYB application."), canTransact: false }
        case "HARD_KYB_FAILED":
            return { status: ("ramp.Failed"), explanation: ("ramp.No transactions allowed. Please contact us at info@mucho.finance"), canTransact: false }
        case "FULL_CORPORATE":
            return { status: ("ramp.Passed"), explanation: ("ramp.Congratulations! You are allowed to transact without limits"), canTransact: true }
        case "SUSPENDED":
            return { status: ("ramp.Corporate suspended"), explanation: ("ramp.No transactions allowed. For further information, contact us at info@mucho.finance"), canTransact: false }
        default:
            return { status: ("ramp.Unknown status"), explanation: ("ramp.No transactions allowed. For further information, contact us at info@mucho.finance"), canTransact: false }
    }
}

export const useGetCorpDetails = (sessionId: string, corporationUuids: string[]): ICorporate[][] => {
    const [corpsDetails, setCorpsDetails] = useState<ICorporate[]>([]);

    const save = (obj: any) => {
        //console.log("****************setting GET CORPORATES", obj);
        if (obj.status !== "KO") {
            obj.response.forEach(r => {
                r.kybStatus = kybStatus(r.status);
            })
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

export const usePatchTokenPrefB2B = (session_id?: string, uuid?: string, currency?: string, token?: ITokenChain) => {
    ///user/target-address
    const { dispatch } = useGlobal();
    const toastify = useToast();
    const [patchResult, setPatchResult] = useState(false);

    const save = (obj: { status: string }) => {
        if (obj.status === "OK") {
            //console.log("Patched ok", obj);
            setPatchResult(true);
        }
        else {
            toastify({ type: "error", msg: t("ramp.Could not set new target token") });
        }
    }

    useEffect(() => {
        if (session_id && uuid && currency && token.token && token.chain) {
            //console.log("Fetching token pref patch");
            fetchFromRampApi(`/corporate/token-preferences`, 'PATCH', { session_id: session_id, uuid, currency: currency, token: token.token, chain: token.chain }, save, dispatch, toastify);
        }
    }, [session_id, currency, token]);

    return [patchResult];
}


export const usePatchAddressB2B = (session_id?: string, uuid?: string, address?: string) => {
    ///user/target-address
    const { dispatch } = useGlobal();
    const toastify = useToast();
    const [patchResult, setPatchResult] = useState(false);

    const save = (obj: { status: string, errorMessage?: string }) => {
        if (obj.status === "OK") {
            //console.log("Patched ok", obj);
            setPatchResult(true);
        }
        else {
            toastify({ type: "error", msg: `${t("ramp.Could not set new target address")}: ${obj.errorMessage ?? ""}` });
        }
    }

    useEffect(() => {
        if (session_id && uuid && address) {
            //console.log("Fetching target address patch");
            fetchFromRampApi(`/corporate/target-address`, 'PATCH', { session_id: session_id, uuid, target_address: address }, save, dispatch, toastify);
        }
    }, [session_id, address]);

    return [patchResult];
}


export const useGetBankAccountsB2B = (sessionId?: string, uuid?: string, reloadTime?: number): (IRampBankAccount[] | undefined)[] => {
    //console.log("*******************GETTING BANK ACCOUNTS********************", sessionId);
    const { dispatch } = useGlobal();
    const [userBAs, setUserBAs] = useState<IRampBankAccount[]>();
    const save = (obj: any) => {
        //console.log("*********************************************************setting user bank accounts", obj);
        //parse
        const filteredBAs = obj.response.filter(t => RAMP_CONFIG.AllowedFiatCurrencies.indexOf(t.currency) >= 0);
        if (filteredBAs)
            setUserBAs(filteredBAs.map(b => {
                return {
                    currency: b.currency,
                    iban: b.iban,
                    isMain: b.main_beneficiary,
                    uuid: b.uuid,
                    name: b.account_name
                };
            }));
    }

    useEffect(() => {
        if (sessionId && uuid) {
            //console.log("FETCHING BANK ACCOUNTS");
            fetchFromRampApi(`/offramp/corporate/bank-accounts`, 'GET', { session_id: sessionId, uuid }, save, () => { });
        }
    }, [sessionId, reloadTime, uuid]);

    return [userBAs];
}


export const useSetMainBankAccountB2B = (sessionId: string, corpUuid: string, uuid: string) => {
    const [result, setResult] = useState({ done: false, status: false, errorMessage: "" });
    //const [rampState, setRampState] = useAtom(rampAtom);

    const save = (obj: { status: string, errorMessage: string }) => {
        //console.log("Obj res main bank account", obj);
        if (obj.status === "OK") {
            //console.log("Set main bank account ok", obj);
            setResult({ done: true, status: true, errorMessage: "" });
            //window.location.reload();
            //setRampState({ ...rampState, isModalOpen: false });
            //window.location.reload();
        }
        else {
            setResult({ done: true, status: false, errorMessage: (obj.errorMessage ? obj.errorMessage : "Could set as main bank account") });
        }
    }

    useEffect(() => {
        if (sessionId && uuid) {
            fetchFromRampApi(`/offramp/corporate/main-bank-account`, 'PATCH', { session_id: sessionId, uuid: uuid, corporate_uuid: corpUuid }, save, () => { });
        }
    }, [sessionId, uuid]);

    return [result];
}

export const useAddAccountB2B = (session_id: string, uuid: string, account: { name: string, iban: string }, currency: string) => {
    const { dispatch } = useGlobal();
    const toastify = useToast();
    const [result, setResult] = useState(false);

    const save = (obj: { status: string, errorMessage?: string }) => {
        //console.log("save useAddAccount", obj);
        if (obj.status === "OK") {
            //console.log("Account added ok", obj);
            setResult(true);
        }
        else {
            toastify({ type: "error", msg: `${t("ramp.Could not add new bank account")}: ${obj.errorMessage ?? ""}` });
        }
    }

    useEffect(() => {
        if (session_id && account.iban && currency) {
            //console.log("Fetching target address patch");
            fetchFromRampApi(`/offramp/corporate/bank-account`, 'POST', { session_id: session_id, uuid, isMain: false, currency, iban: account.iban, name: account.name ?? "" }, save, dispatch, toastify);
        }
    }, [session_id, account, currency]);

    return [result];
}


export const useOffRampWalletB2B = (sessionId: string, uuid: string, chain: string) => {
    const { dispatch } = useGlobal();
    const [wallet, setWallet] = useState("");

    const save = (obj: any) => {
        console.log("$$$$$$$$$$$$$$$$$$$$  Got corp wallet", obj, sessionId, chain);
        if (obj.status !== "KO") {
            setWallet(obj.response[0].address);
        }
    }

    useEffect(() => {
        if (sessionId && chain && uuid) {
            console.log("FETCHING OFFRAMP CORP WALLET");
            fetchFromRampApi(`/offramp/corporate/wallet`, 'GET', { session_id: sessionId, chain, uuid }, save, dispatch);
        }
    }, [sessionId, chain, uuid]);

    return [wallet];
}