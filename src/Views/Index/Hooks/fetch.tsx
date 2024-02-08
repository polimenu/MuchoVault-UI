import { encode } from 'querystring';
import { APIFARMURL } from '../Config/mIndexConfig';
import { t } from 'i18next';


export function fetchFromFarmApi(call: string, method: string, params: any, saveFunction: any, dispatch: any, toastify: any = null) {

    if (method == 'GET') {
        call = call + '?' + encode(params);
    }
    call = `${APIFARMURL}${call}`

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
