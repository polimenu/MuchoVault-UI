import { useState } from 'react';
import { encode } from 'querystring';
import { useGlobal } from '@Contexts/Global';
//import auth0 from 'auth0-js';

const APIRAMPURL = 'http://localhost:3000';

function useGetRampTransactions(sessionId: string) {
    return useFetch(`${APIRAMPURL}/transactions`, 'GET', { session_id: sessionId });
}

function useLoginByEmail(email: string) {
    return useFetch(`${APIRAMPURL}/user-login`, 'POST', { email: email });
}

export const useOtpLogin = (email: string, otp: string) => {
    return useFetch(`${APIRAMPURL}/login/otp-email`, 'POST', { email: email, otp: otp });
}

function useCountries() {
    return useFetch(`${APIRAMPURL}/countries`, 'GET', {});
}

function useFetch(url: string, method: string, params: any) {
    /*const webAuth = new auth0.WebAuth({
        domain: 'dev-q0bvdmwaku11gjvx.us.auth0.com',
        clientID: 'LewFivibk9f9aC4FYA3jrZEUMvE5ymaN',
        audience: 'https://mucho.finance/ramp-api'
    });*/
    const [data, setData] = useState([]);
    const { dispatch } = useGlobal();

    if (method == 'GET') {
        url = url + '?' + encode(params);
    }


    const fetchIt = () => {
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
                setData(json);
            })
        });
    }

    return [data, fetchIt];
}

export { useCountries, useLoginByEmail, useGetRampTransactions };