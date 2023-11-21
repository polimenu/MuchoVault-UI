import { useEffect, useState } from 'react';
import { encode } from 'querystring';
import { useGlobal } from '@Contexts/Global';
import { useToast } from '@Contexts/Toast';
//import auth0 from 'auth0-js';

const APIRAMPURL = 'http://localhost:3000';

export interface IUserDetails {
    address: {
        address_line_1: string;
        city: string;
        address_line_2: string;
        country: string;
        post_code: string;
    };
    date_of_birth: string;
    target_address: string;
    email: string;
    first_name: string;
    last_name: string;
    status: string;
    uuid: string;
    bvn: string;
}

export const useGetUserDetails = (sessionId: string): (IUserDetails | undefined)[] => {
    const { dispatch } = useGlobal();
    const [userDetails, setUserDetails] = useState<IUserDetails>();
    const save = (obj: IUserDetails) => {
        console.log("setting user details", obj);
        //parse date
        obj.date_of_birth = obj.date_of_birth && obj.date_of_birth.substring(0, 10);
        setUserDetails(obj);
    }

    useEffect(() => {
        if (sessionId)
            fetchFromApi(`${APIRAMPURL}/user-details`, 'GET', { session_id: sessionId }, save, dispatch);
    }, [sessionId]);

    return [userDetails];
}


export interface ITokenPreference {
    currency: string;
    chain: string;
    token: string;
}

export const useGetTokenPreferences = (sessionId: string): (ITokenPreference[] | undefined)[] => {
    const { dispatch } = useGlobal();
    const [userTPs, setUserTPs] = useState<ITokenPreference[]>();
    const save = (obj: ITokenPreference[]) => {
        console.log("setting user token preferences", obj);
        //parse date
        setUserTPs(obj);
    }

    useEffect(() => {
        if (sessionId)
            fetchFromApi(`${APIRAMPURL}/token-preferences`, 'GET', { session_id: sessionId }, save, dispatch);
    }, [sessionId]);

    return [userTPs];
}



export interface ITransaction {
    status: string,
    user_uuid: string,
    direction: string,
    input: {
        amount: number,
        currency: string,
        transaction_id: string
    },
    output: { currency: string }
}

export const useGetRampTransactions = (sessionId: string): (ITransaction[] | undefined)[] => {
    const { dispatch } = useGlobal();
    const [transactions, setTransactions] = useState<ITransaction[]>();
    const save = (obj: ITransaction[]) => {
        console.log("setting transactions", obj);
        setTransactions(obj);
    }

    useEffect(() => {
        if (!sessionId)
            save([]);
        else
            fetchFromApi(`${APIRAMPURL}/transactions`, 'GET', { session_id: sessionId }, save, dispatch);
    }, [sessionId]);

    return [transactions];
}

export interface IRampCurrency {
    currency_name: string;
    currency_label: string;
    network_name?: string[];
}

export const useRampTokens = () => {
    const { dispatch } = useGlobal();
    const toastify = useToast();
    const [tokens, setTokens] = useState<IRampCurrency[]>([]);
    const save = (obj: IRampCurrency[]) => {
        console.log("Saving token currencies", obj);
        setTokens(obj.filter(o => o.network_name && o.network_name.length > 0));
    }

    useEffect(() => {
        fetchFromApi(`${APIRAMPURL}/currencies`, 'GET', {}, save, dispatch, toastify);
    }, []);


    return [tokens];

}

export const useOtpSent = (email: string) => {
    const { dispatch } = useGlobal();
    const toastify = useToast();
    const [loginStatus, setLoginStatus] = useState(false);
    const save = (obj: { status: string, errorMessage?: string }) => {
        console.log("Saving login by email", obj);
        if (obj.status === "OK")
            setLoginStatus(true);
        else
            toastify({ type: "error", msg: obj.errorMessage });
    }

    useEffect(() => {
        if (!email)
            setLoginStatus(false);
        else {
            console.log("Fetching login by email");
            console.log("Sending toaster", toastify);
            fetchFromApi(`${APIRAMPURL}/user-login`, 'POST', { email: email }, save, dispatch, toastify);
        }
    }, [email]);


    return [loginStatus];
}

export const useRampSession = () => {
    const [session, setSession] = useState('');
    const savedSession = sessionStorage.getItem("ramp_session_id");
    if (savedSession && savedSession != session)
        setSession(savedSession);

    return [session, setSession];
}

export interface ITokenChain {
    token: string;
    chain: string;
}

export const usePatchTokenPref = (session_id: string, currency: string, token: ITokenChain) => {
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
            fetchFromApi(`${APIRAMPURL}/token-preferences`, 'PATCH', { session_id: session_id, currency: currency, token: token.token, chain: token.chain }, save, dispatch, toastify);
        }
    }, [session_id, currency, token]);

    return [patchResult];
}

export const usePatchAddress = (session_id: string, address: string) => {
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
            fetchFromApi(`${APIRAMPURL}/user/target-address`, 'PATCH', { session_id: session_id, target_address: address }, save, dispatch, toastify);
        }
    }, [session_id, address]);

    return [patchResult];
}

export const useOtpLogin = (email: string, otp: string, saveSession: any) => {
    const { dispatch } = useGlobal();
    const toastify = useToast();
    const saveLogin = (obj: { session_id: string }) => {
        if (obj.status === "OK") {
            console.log("Saving session", obj);
            saveSession(obj.session_id);
            sessionStorage.setItem("ramp_session_id", obj.session_id);
        }
        else {
            toastify({ type: "error", msg: "Invalid OTP code" });
        }
    }

    useEffect(() => {
        if (email && otp) {
            console.log("Fetching OTP session");
            fetchFromApi(`${APIRAMPURL}/login/otp-email`, 'POST', { email: email, otp: otp }, saveLogin, dispatch, toastify);
        }
        /*else {
            console.log("Saving null session");
            saveSession('');
        }*/
    }, [email, otp]);
}

/*export const useCountries = () => {
    return useFetch(`${APIRAMPURL}/countries`, 'GET', {});
}*/

function fetchFromApi(url: string, method: string, params: any, saveFunction: any, dispatch: any, toastify: any = null) {

    if (method == 'GET') {
        url = url + '?' + encode(params);
    }

    console.log("Sending request", url, method, params);

    dispatch({ type: 'SET_TXN_LOADING', payload: 1 });
    fetch(url, {
        method: method,
        headers: {
            'Accept': "application/json",
            'Content-Type': "application/json",
        },
        body: (method === 'GET') ? null : JSON.stringify(params),
    }).then(response => {
        response.json().then(json => {
            dispatch({ type: 'SET_TXN_LOADING', payload: 0 });
            console.log("Txn finished", json);
            saveFunction(json);
        })
    }).catch(e => {
        console.log("Error API", e);
        if (toastify) {
            toastify({
                type: 'error',
                msg: "Unknown error",
            });
        }
        dispatch({ type: 'SET_TXN_LOADING', payload: 0 });
    });
}
