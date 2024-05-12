import { useEffect, useState } from 'react';
import { IPoolDetail, poolsAtom } from '../poolsAtom';
import { useGlobal } from '@Contexts/Global';
import { useAtom } from 'jotai';
import { useLoaderData } from 'react-router-dom';


export const useGetPoolDetail = () => {
    const poolId = useLoaderData();
    //console.log("poolIdz", poolId);
    const { dispatch } = useGlobal();
    const [poolsState, setPoolsState] = useAtom(poolsAtom);
    const [pool, setPool] = useState<IPoolDetail>();


    const parsePool = (poolRes: any) => {
        poolRes.history.forEach(h => {
            const dt = new Date(`${h.date.substring(0, 4)}-${h.date.substring(4, 6)}-${h.date.substring(6, 8)}T${h.date.substring(8, 10)}:${h.date.substring(10, 12)}:${h.date.substring(12, 14)}.000Z`);
            h.date = dt;
            h.epoch = dt.getTime();
        });
        return poolRes;
    }

    useEffect(() => {

        //console.log("Fetching pool detail", url);
        if (poolsState.pairAddress) {
            //console.log("getting pool", poolsState.pairAddress)
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
        else if (poolId) {
            setPoolsState({ ...poolsState, pairAddress: poolId })
        }
        else {
            //console.log("Unsetting pool");
            setPool(undefined);
        }

    }, [poolsState.pairAddress])


    return [pool];

}
