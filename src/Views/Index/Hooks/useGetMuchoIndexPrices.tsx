import { useGlobal } from "@Contexts/Global";
import { fetchFromIndexApi } from "./fetch";
import { useEffect, useState } from 'react';
import { IIndexPrice, IMuchoIndexDailyPrice } from "../IndexAtom";

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


export const useGetMuchoIndexLatestPrices = () => {
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



export const useGetMuchoIndexDailyPrices = () => {
    const { dispatch } = useGlobal();
    const [dailyPrices, setDailyPrices] = useState<IMuchoIndexDailyPrice[]>();

    const save = (obj: any) => {
        if (obj.prices) {
            //console.log("Setting latest price", obj);
            setDailyPrices(obj.prices);
            //console.log("Set latest price", latestPrice);
        }
    }

    useEffect(() => {
        fetchFromIndexApi(`/dailyPrices`, 'GET', {}, save, dispatch);
    }, []);

    return [dailyPrices];
}