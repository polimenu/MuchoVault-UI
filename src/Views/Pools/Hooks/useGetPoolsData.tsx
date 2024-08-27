import { useEffect, useMemo, useState } from 'react';
import { IPool, IPoolsData } from '../poolsAtom';
import { useGlobal } from '@Contexts/Global';
import { APIINDEXURL } from '@Views/Index/Config/mIndexConfig';


export const useGetPoolsData = () => {
    let poolsData: IPoolsData = {
        pools: [],
    };

    //Masters
    [poolsData.pools] = useGetPools();

    return useMemo(() => poolsData, [
        poolsData.pools
    ]);
}


const useGetPools = () => {
    const url = `${APIINDEXURL}/pools`;
    const { dispatch } = useGlobal();
    const [pools, setPools] = useState<IPool[]>();

    useEffect(() => {
        //console.log("Fetching pools");

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
                //console.log("Pools Txn finished", json);
                setPools(json.pools);
            })
        }).catch(e => {
            console.log("Error API", e);
            dispatch({ type: 'SET_TXN_LOADING', payload: 0 });
        });

    }, [])


    return [pools];

}
