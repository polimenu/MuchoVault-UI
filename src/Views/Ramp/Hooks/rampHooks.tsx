import { useState } from 'react';
import { encode } from 'querystring';
import { useGlobal } from '@Contexts/Global';
//import auth0 from 'auth0-js';

const APIRAMPURL = 'http://localhost:3000';

export const useGetRampTransactions = (sessionId: string, setTransactions: any) => {
    const save = (obj: any[]) => {
        console.log("setting transactions", obj);
        setTransactions(obj);
    }
    fetchFromApi(`${APIRAMPURL}/transactions`, 'GET', { session_id: sessionId }, save);
}

export const setLoginByEmail = (email: string, setLoginStatus: any) => {
    console.log("Ferching login by email");
    const save = (obj: { status: string }) => {
        console.log("Saving login by email", obj);
        setLoginStatus(obj.status === "OK");
    }
    fetchFromApi(`${APIRAMPURL}/user-login`, 'POST', { email: email }, save);
}

export const useOtpLogin = (email: string, otp: string, saveSession: any) => {
    const saveLogin = (obj: { session_id: string }) => {
        console.log("Saving session", obj);
        saveSession(obj.session_id);
        sessionStorage.setItem("ramp_session_id", obj.session_id);
    }
    return fetchFromApi(`${APIRAMPURL}/login/otp-email`, 'POST', { email: email, otp: otp }, saveLogin);
}

/*export const useCountries = () => {
    return useFetch(`${APIRAMPURL}/countries`, 'GET', {});
}*/

function fetchFromApi(url: string, method: string, params: any, saveFunction: any) {
    /*const webAuth = new auth0.WebAuth({
        domain: 'dev-q0bvdmwaku11gjvx.us.auth0.com',
        clientID: 'LewFivibk9f9aC4FYA3jrZEUMvE5ymaN',
        audience: 'https://mucho.finance/ramp-api'
    });*/
    //const { dispatch } = useGlobal();

    if (method == 'GET') {
        url = url + '?' + encode(params);
    }

    //dispatch({ type: 'SET_TXN_LOADING', payload: 1 });
    fetch(url, {
        method: method,
        headers: {
            'Accept': "application/json",
            'Content-Type': "application/json",
        },
        body: (method === 'GET') ? null : JSON.stringify(params),
    }).then(response => {
        response.json().then(json => {
            //dispatch({ type: 'SET_TXN_LOADING', payload: 0 });
            console.log("Txn finished", json);
            saveFunction(json);
        })
    });
}
