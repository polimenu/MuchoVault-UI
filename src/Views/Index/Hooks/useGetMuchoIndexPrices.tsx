import { useGlobal } from "@Contexts/Global";
import { fetchFromIndexApi } from "./fetch";
import { useEffect, useState } from 'react';
import { IIndexPrice } from "../IndexAtom";

export const useGetMuchoIndexLatestPrice = () => {
    const { dispatch } = useGlobal();
    const [latestPrice, setLatestPrice] = useState<IIndexPrice>();

    const save = (obj: any) => {
        if (obj.price) {
            //console.log("Setting latest price", obj);
            setLatestPrice({
                price: obj.price,
                buyPrice: obj.buyPrice,
                sellPrice: obj.sellPrice,
                updated: new Date(obj.timestamp * 1000),
                composition: obj.composition,
                initPrice: obj.initPrice,
                initTs: obj.initTs
            });
            //console.log("Set latest price", latestPrice);
        }
    }

    useEffect(() => {
        const call = () => {
            //console.log("CALLING GET TRANSACTIONS");
            fetchFromIndexApi(`/latestPrice`, 'GET', {}, save, dispatch);
        }
        call();
        const interval = setInterval(() => call(), 60 * 1000);
        return () => {
            clearInterval(interval);
        }
    }, []);

    return [latestPrice];
}


export const useGetRampTransactions = (sessionId?: string): (IRampTransaction[] | undefined)[] => {
    const { dispatch } = useGlobal();
    const [transactions, setTransactions] = useState<IRampTransaction[]>();
    const save = (obj: { response: IRampTransaction[] }) => {
        //console.log("setting transactions", obj);
        setTransactions(obj.response);
    }

    useEffect(() => {
        if (!sessionId)
            save([]);
        else {
            const call = () => {
                //console.log("CALLING GET TRANSACTIONS");
                fetchFromRampApi(`/transactions`, 'GET', { session_id: sessionId }, save, () => { });
            }
            call();
            const interval = setInterval(() => call(), RAMP_CONFIG.DelayTransactionsRefreshSeconds * 1000);
            return () => {
                clearInterval(interval);
            }
        }
    }, [sessionId]);

    return [transactions];
}