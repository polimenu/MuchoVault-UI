import { useEffect, useState } from 'react';
import { encode } from 'querystring';
import { useGlobal } from '@Contexts/Global';
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

export const useOtpSent = (email: string) => {
    const { dispatch } = useGlobal();
    const [loginStatus, setLoginStatus] = useState(false);
    const save = (obj: { status: string }) => {
        console.log("Saving login by email", obj);
        setLoginStatus(obj.status === "OK");
    }

    useEffect(() => {
        if (!email)
            setLoginStatus(false);
        else {
            console.log("Ferching login by email");
            fetchFromApi(`${APIRAMPURL}/user-login`, 'POST', { email: email }, save, dispatch);
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

export const useOtpLogin = (email: string, otp: string, saveSession: any) => {
    const { dispatch } = useGlobal();
    const saveLogin = (obj: { session_id: string }) => {
        console.log("Saving session", obj);
        saveSession(obj.session_id);
        sessionStorage.setItem("ramp_session_id", obj.session_id);
    }

    useEffect(() => {
        if (email && otp) {
            console.log("Fetching OTP session");
            fetchFromApi(`${APIRAMPURL}/login/otp-email`, 'POST', { email: email, otp: otp }, saveLogin, dispatch);
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

function fetchFromApi(url: string, method: string, params: any, saveFunction: any, dispatch: any) {

    if (method == 'GET') {
        url = url + '?' + encode(params);
    }

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
    });
}
