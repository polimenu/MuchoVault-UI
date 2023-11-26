import { useGlobal } from "@Contexts/Global";
import { useToast } from "@Contexts/Toast";
import { fetchFromRampApi } from "./fetch";
import { useEffect, useState } from "react";
import { IRampTokenPreference, IRampTransaction, IRampUserDetails } from "../rampAtom";
import { RAMP_CONFIG } from "../Config/rampConfig";


export interface ITokenChain {
    token: string;
    chain: string;
}


const kycStatus = (userStatus: string): string => {
    switch (userStatus) {
        case "CREATED":
            return "Pending. 1 transaction allowed (<700€)."
        case "KYC_NEEDED":
            return "Pending. No transactions allowed."
        case "PENDING_KYC_DATA":
            return "Pending to receive your data. No transactions allowed."
        case "KYC_PENDING":
            return "Verification in progress. No transactions allowed."
        case "SOFT_KYC_FAILED":
            return "Failed. No transactions allowed."
        case "HARD_KYC_FAILED":
            return "Failed. No transactions allowed."
        case "FULL_USER":
            return "Done!"
        case "SUSPENDED":
            return "User suspended."
        default:
            return "Unknown status - " + userStatus;
    }
}

export const useGetUserDetails = (sessionId?: string): (IRampUserDetails | undefined)[] => {
    const { dispatch } = useGlobal();
    const [userDetails, setUserDetails] = useState<IRampUserDetails>();

    const save = (obj: IRampUserDetails) => {
        console.log("setting user details", obj);
        //parse date
        obj.date_of_birth = obj.date_of_birth && obj.date_of_birth.substring(0, 10);
        obj.kyc_status = kycStatus(obj.status);
        obj.canCreateKYC = (["CREATED", "KYC_NEEDED"].indexOf(obj.status) >= 0);
        setUserDetails(obj);
    }

    useEffect(() => {
        if (sessionId)
            fetchFromRampApi(`/user-details`, 'GET', { session_id: sessionId }, save, dispatch);
    }, [sessionId]);

    return [userDetails];
}


export const useGetTokenPreferences = (sessionId?: string): (IRampTokenPreference[] | undefined)[] => {
    const { dispatch } = useGlobal();
    const [userTPs, setUserTPs] = useState<IRampTokenPreference[]>();
    const save = (obj: IRampTokenPreference[]) => {
        console.log("setting user token preferences", obj);
        //parse date
        setUserTPs(obj.filter(t => RAMP_CONFIG.AllowedFiatCurrencies.indexOf(t.currency) >= 0));
    }

    useEffect(() => {
        if (sessionId)
            fetchFromRampApi(`/token-preferences`, 'GET', { session_id: sessionId }, save, dispatch);
    }, [sessionId]);

    return [userTPs];
}

export const useGetRampTransactions = (sessionId?: string): (IRampTransaction[] | undefined)[] => {
    const { dispatch } = useGlobal();
    const [transactions, setTransactions] = useState<IRampTransaction[]>();
    const save = (obj: IRampTransaction[]) => {
        console.log("setting transactions", obj);
        setTransactions(obj);
    }

    useEffect(() => {
        if (!sessionId)
            save([]);
        else
            fetchFromRampApi(`/transactions`, 'GET', { session_id: sessionId }, save, dispatch);
    }, [sessionId]);

    return [transactions];
}

export const usePatchTokenPref = (session_id?: string, currency: string, token: ITokenChain) => {
    ///user/target-address
    const { dispatch } = useGlobal();
    const toastify = useToast();
    const [patchResult, setPatchResult] = useState(false);

    const save = (obj: { status: string }) => {
        if (obj.status === "OK") {
            console.log("Patched ok", obj);
            setPatchResult(true);
        }
        else {
            toastify({ type: "error", msg: "Could not set new target token" });
        }
    }

    useEffect(() => {
        if (session_id && currency && token.token && token.chain) {
            console.log("Fetching token pref patch");
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

    const save = (obj: { status: string }) => {
        if (obj.status === "OK") {
            console.log("Patched ok", obj);
            setPatchResult(true);
        }
        else {
            toastify({ type: "error", msg: "Could not set new target address" });
        }
    }

    useEffect(() => {
        if (session_id && address) {
            console.log("Fetching target address patch");
            fetchFromRampApi(`/user/target-address`, 'PATCH', { session_id: session_id, target_address: address }, save, dispatch, toastify);
        }
    }, [session_id, address]);

    return [patchResult];
}
