import { encode } from 'querystring';
import { APIINDEXURL } from '../Config/mIndexConfig';
import { t } from 'i18next';


export function fetchFromIndexApi(call: string, method: string, params: any, saveFunction: any, dispatch: any, toastify: any = null) {
    return fetchFromApi(APIINDEXURL, call, method, params, saveFunction, dispatch, toastify);
}


export async function asyncFetchFromIndexApi(call: string, method: string, params: any, dispatch: any, toastify: any = null) {
    return asyncFetchFromApi(APIINDEXURL, call, method, params, dispatch, toastify);
}

function fetchFromApi(url: string, call: string, method: string, params: any, saveFunction: any, dispatch: any, toastify: any = null) {

    if (method == 'GET') {
        call = call + '?' + encode(params);
    }
    call = `${url}${call}`

    //console.log("Sending request", call, method, params);

    dispatch({ type: 'SET_TXN_LOADING', payload: 1 });
    fetch(call, {
        method: method,
        headers: {
            'Accept': "application/json",
            'Content-Type': "application/json",
        },
        body: (method === 'GET') ? null : JSON.stringify(params),
    }).then(response => {
        response.json().then(json => {
            dispatch({ type: 'SET_TXN_LOADING', payload: 0 });
            //console.log("Txn finished", json);
            saveFunction(json);
        })
    }).catch(e => {
        console.log("Error API", e);
        if (toastify) {
            toastify({
                type: 'error',
                msg: t("ramp.Unknown error"),
            });
        }
        dispatch({ type: 'SET_TXN_LOADING', payload: 0 });
    });
}

async function asyncFetchFromApi(url: string, call: string, method: string, params: any, dispatch: any, toastify: any = null) {

    if (method == 'GET') {
        call = call + '?' + encode(params);
    }
    call = `${url}${call}`

    //console.log("Sending request", call, method, params);

    dispatch({ type: 'SET_TXN_LOADING', payload: 1 });
    try {
        const fetchRes = await fetch(call, {
            method: method,
            headers: {
                'Accept': "application/json",
                'Content-Type': "application/json",
            },
            body: (method === 'GET') ? null : JSON.stringify(params),
        });

        const resJson = await fetchRes.json();
        dispatch({ type: 'SET_TXN_LOADING', payload: 0 });
        return resJson;

    }
    catch (e) {
        console.log("Error API", e);
        if (toastify) {
            toastify({
                type: 'error',
                msg: t("ramp.Unknown error"),
            });
        }
        dispatch({ type: 'SET_TXN_LOADING', payload: 0 });
    }
}