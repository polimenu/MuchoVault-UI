import { useEffect, useState } from 'react';
import { IPoolDetail, poolsAtom } from '../poolsAtom';
import { useGlobal } from '@Contexts/Global';
import { useAtom } from 'jotai';
import { APIINDEXURL } from '@Views/Index/Config/mIndexConfig';


export const useGetPoolDetail = (poolId: string) => {
    const { dispatch } = useGlobal();
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
        //console.log("Fetching pool detail", poolId);
        if (poolId) {

            const url = `${APIINDEXURL}/pool/history?id=` + poolId;

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
                    //console.log("Pool detail Txn finished", json.pool);
                })
            }).catch(e => {
                console.log("Error API", e);
                dispatch({ type: 'SET_TXN_LOADING', payload: 0 });
            });

        }
        else {
            //console.log("Unsetting pool");
            setPool(undefined);
        }

    }, [poolId])


    return [pool];

}
