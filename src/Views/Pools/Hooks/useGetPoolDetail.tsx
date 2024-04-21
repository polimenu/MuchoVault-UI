import { useEffect, useState } from 'react';
import { IPoolDetail, poolsAtom } from '../poolsAtom';
import { useGlobal } from '@Contexts/Global';
import { useAtom } from 'jotai';


export const useGetPoolDetail = () => {
    const { dispatch } = useGlobal();
    const [poolsState,] = useAtom(poolsAtom);
    const [pool, setPool] = useState<IPoolDetail>();

    const parsePool = (poolRes: any) => {
        poolRes.history.forEach(h => h.date = new Date(`${h.date.substring(0, 4)}-${h.date.substring(4, 6)}-${h.date.substring(6, 8)}T00:00:00.000Z`));
        return poolRes;
    }

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
                    setPool(parsePool(json.pool));
                    //console.log("Pool detail Txn finished", pool);
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
