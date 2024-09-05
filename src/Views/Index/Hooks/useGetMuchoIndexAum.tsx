import { useGlobal } from "@Contexts/Global";
import { fetchFromIndexApi } from "./fetch";
import { useEffect, useState } from 'react';
import { IIndexAum } from "../IndexAtom";

export const useGetMuchoIndexAum = () => {
    const { dispatch } = useGlobal();
    const [latestPrice, setLatestPrice] = useState<IIndexAum>();

    const save = (obj: any) => {
        if (obj.price) {
            //console.log("Setting latest price", obj);
            setLatestPrice({
                price: obj.price,
                buyPrice: obj.buyPrice,
                sellPrice: obj.sellPrice,
                updated: new Date(obj.timestamp * 1000),
                composition: obj.composition,
                aum: obj.aum
            });
            //console.log("Set latest price", latestPrice);
        }
    }

    useEffect(() => {
        fetchFromIndexApi(`/aum`, 'GET', {}, save, dispatch);
    }, []);

    return [latestPrice];
}