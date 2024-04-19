import { useEffect, useState } from 'react';
import { IPoolDetail, poolsAtom } from '../poolsAtom';
import { useGlobal } from '@Contexts/Global';
import { useAtom } from 'jotai';


export const useGetPoolDetail = () => {
    const { dispatch } = useGlobal();
    const [poolsState,] = useAtom(poolsAtom);
    const [pool, setPool] = useState<IPoolDetail>();

    useEffect(() => {
        //console.log("Fetching pool detail", url);
        if (poolsState.pairAddress) {

            const url = "https://apiindex.mucho.finance/pool/history?id=" + poolsState.pairAddress;

            dispatch({ type: 'SET_TXN_LOADING', payload: 1 });
            fetch(url, {
                method: "GET",
                headers: {
                    'Accept': "application/json",
                    'Content-Type': "application/json",
                },
            }).then(response => {
                response.json().then(json => {
                    dispatch({ type: 'SET_TXN_LOADING', payload: 0 });
                    //console.log("Pool detail Txn finished", json);
                    setPool(json.pool);
                })
            }).catch(e => {
                console.log("Error API", e);
                dispatch({ type: 'SET_TXN_LOADING', payload: 0 });
            });

        }
        else {
            console.log("Unsetting pool");
            setPool(undefined);
        }

    }, [poolsState.pairAddress])


    return [pool];

}
