import { useGlobal } from "@Contexts/Global";
import { useToast } from "@Contexts/Toast";
import { fetchFromRampApi } from "./fetch";
import { useEffect, useState } from "react";
import { ERampStatus, IRampBankAccount, IRampTokenPreference, IRampTransaction, IRampUserDetails, rampAtom } from "../rampAtom";
import { RAMP_CONFIG } from "../Config/rampConfig";
import { useAtom } from "jotai";
import { useLogout } from "./login";
import { t } from "i18next";


export interface ITokenChain {
    token: string;
    chain: string;
}


export interface INewUserRequest {
    first_name: string;
    last_name: string;
    email: string;
    country: string;
}

const validateNewUser = (request: INewUserRequest): [boolean, string] => {
    if (request.first_name.length < 3)
        return [true, t("ramp.First name is required")];
    if (request.last_name.length < 3)
        return [true, t("ramp.Last name is required")];
    if (request.email.length < 3)
        return [true, t("ramp.E-mail is required")];
    if (request.country.length !== 2)
        return [true, t("ramp.Country is required")];

    return [false, ""];
}


const kycStatus = (userStatus: string): { status: string, explanation: string, canTransact: boolean } => {
    switch (userStatus) {
        case "CREATED":
            return { status: ("ramp.Pending"), explanation: ("ramp.You are only allowed to make 1 transaction, for less than 700€"), canTransact: true }
        case "KYC_NEEDED":
            return { status: ("ramp.Pending"), explanation: ("ramp.No transactions allowed. You need to finish your KYC."), canTransact: false }
        case "PENDING_KYC_DATA":
            return { status: ("ramp.Pending to receive KYC data"), explanation: ("ramp.No transactions allowed. Please finish your KYC."), canTransact: false }
        case "KYC_PENDING":
            return { status: ("ramp.Verification in progress"), explanation: ("ramp.No transactions allowed. Please wait until KYC revision is ended."), canTransact: false }
        case "SOFT_KYC_FAILED":
            return { status: ("ramp.Failed"), explanation: ("ramp.No transactions allowed. You can retry your KYC application."), canTransact: false }
        case "HARD_KYC_FAILED":
            return { status: ("ramp.Failed"), explanation: ("ramp.No transactions allowed. Please contact us at info@mucho.finance"), canTransact: false }
        case "FULL_USER":
            return { status: ("ramp.Passed"), explanation: ("ramp.Congratulations! You are allowed to transact without limits"), canTransact: true }
        case "SUSPENDED":
            return { status: ("ramp.User suspended"), explanation: ("ramp.No transactions allowed. For further information, contact us at info@mucho.finance"), canTransact: false }
        default:
            return { status: ("ramp.Unknown status"), explanation: ("ramp.No transactions allowed. For further information, contact us at info@mucho.finance"), canTransact: false }
    }
}

export const useGetUserDetails = (sessionId?: string): (IRampUserDetails | undefined)[] => {
    const { dispatch } = useGlobal();
    const [userDetails, setUserDetails] = useState<IRampUserDetails>();

    const save = (obj: any) => {
        //console.log("setting user details", obj);
        if (obj.status !== "KO") {
            //parse date
            //console.log("Parsing user data", obj);
            if (obj.response.date_of_birth)
                obj.response.date_of_birth = obj.response.date_of_birth && obj.response.date_of_birth.substring(0, 10);
            else
                obj.response.date_of_birth = "";

            obj.response.kyc_status = kycStatus(obj.response.status);
            obj.response.canCreateKYC = (["CREATED", "KYC_NEEDED"].indexOf(obj.response.status) >= 0);
            //console.log("Parsed user data", obj);
            setUserDetails(obj.response);
        }
        else {
            useLogout();
        }
    }

    useEffect(() => {
        if (sessionId) {
            fetchFromRampApi(`/user-details`, 'GET', { session_id: sessionId }, save, dispatch);
        }
    }, [sessionId]);

    return [userDetails];
}


export const useGetTokenPreferences = (sessionId?: string): (IRampTokenPreference[] | undefined)[] => {
    const { dispatch } = useGlobal();
    const [userTPs, setUserTPs] = useState<IRampTokenPreference[]>();
    const save = (obj: { response: IRampTokenPreference[] }) => {
        //console.log("setting user token preferences", obj);
        //parse date
        setUserTPs(obj.response.filter(t => RAMP_CONFIG.AllowedFiatCurrencies.indexOf(t.currency) >= 0));
    }

    useEffect(() => {
        if (sessionId)
            fetchFromRampApi(`/token-preferences`, 'GET', { session_id: sessionId }, save, dispatch);
    }, [sessionId]);

    return [userTPs];
}


export const useGetBankAccounts = (sessionId?: string): (IRampBankAccount[] | undefined)[] => {
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
        if (sessionId) {
            fetchFromRampApi(`/offramp/bank-accounts`, 'GET', { session_id: sessionId }, save, dispatch);
        }
    }, [sessionId]);

    return [userBAs];
}

export const useGetRampTransactions = (sessionId?: string): (IRampTransaction[] | undefined)[] => {
    const { dispatch } = useGlobal();
    const [transactions, setTransactions] = useState<IRampTransaction[]>();
    const save = (obj: { response: IRampTransaction[] }) => {
        //console.log("setting transactions", obj);
        setTransactions(obj.response);
    }

    useEffect(() => {
        if (!sessionId)
            save([]);
        else {
            const call = () => {
                //console.log("CALLING GET TRANSACTIONS");
                fetchFromRampApi(`/transactions`, 'GET', { session_id: sessionId }, save, () => { });
            }
            call();
            const interval = setInterval(() => call(), RAMP_CONFIG.DelayTransactionsRefreshSeconds * 1000);
            return () => {
                clearInterval(interval);
            }
        }
    }, [sessionId]);

    return [transactions];
}

export const useSetMainBankAccount = (sessionId: string, uuid: string, go: boolean) => {
    //console.log("*******************GETTING BANK ACCOUNTS********************", sessionId);
    const { dispatch } = useGlobal();
    const [result, setResult] = useState({ done: false, status: false, errorMessage: "" });
    //const [rampState, setRampState] = useAtom(rampAtom);

    const save = (obj: { status: string, errorMessage: string }) => {
        //console.log("Obj res main bank account", obj);
        if (obj.status === "OK") {
            //console.log("Set main bank account ok", obj);
            setResult({ done: true, status: true, errorMessage: "" });
            //window.location.reload();
            //setRampState({ ...rampState, isModalOpen: false });
            window.location.reload();
        }
        else {
            setResult({ done: true, status: false, errorMessage: (obj.errorMessage ? obj.errorMessage : "Could set as main bank account") });
        }
    }

    useEffect(() => {
        if (sessionId && uuid && go) {
            fetchFromRampApi(`/offramp/main-bank-account`, 'PATCH', { session_id: sessionId, uuid: uuid }, save, dispatch);
        }
    }, [sessionId, uuid, go]);

    return [result];
}


export const useCreateUser = (request?: INewUserRequest) => {
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
            toastify(t("ramp.User successfully created. You can login now."));
            setRampState({ ...rampState, isModalOpen: false });
        }
        else {
            toastify({ type: "error", msg: (obj.errorMessage ? obj.errorMessage : t("ramp.Could not create User")) });
        }
    }

    useEffect(() => {
        if (request && request.first_name && request.last_name && request.country && request.email) {
            const [isError, message] = validateNewUser(request);
            if (!isError) {
                console.log("Fetching User creation");
                fetchFromRampApi('/user', 'POST', request, save, dispatch, toastify);
            }
            else {
                toastify({ type: "error", msg: message });
            }
        }
    }, [request]);

    return [result];
}

export const usePatchTokenPref = (session_id?: string, currency: string, token: ITokenChain) => {
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
        if (session_id && currency && token.token && token.chain) {
            //console.log("Fetching token pref patch");
            fetchFromRampApi(`/token-preferences`, 'PATCH', { session_id: session_id, currency: currency, token: token.token, chain: token.chain }, save, dispatch, toastify);
        }
    }, [session_id, currency, token]);

    return [patchResult];
}

export const usePatchAddress = (session_id?: string, address: string) => {
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
        if (session_id && address) {
            //console.log("Fetching target address patch");
            fetchFromRampApi(`/user/target-address`, 'PATCH', { session_id: session_id, target_address: address }, save, dispatch, toastify);
        }
    }, [session_id, address]);

    return [patchResult];
}


export const useAddAccount = (session_id: string, account: { name: string, iban: string }, currency: string) => {
    const { dispatch } = useGlobal();
    const toastify = useToast();
    const [result, setResult] = useState(false);

    const save = (obj: { status: string, errorMessage?: string }) => {
        console.log("save useAddAccount", obj);
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
            fetchFromRampApi(`/offramp/bank-account`, 'POST', { session_id: session_id, isMain: false, currency, iban: account.iban, name: account.name ?? "" }, save, dispatch, toastify);
        }
    }, [session_id, account, currency]);

    return [result];
}