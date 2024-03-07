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
                price: obj.price, updated: new Date(obj.timestamp * 1000),
                composition: obj.composition,
                initPrice: obj.initPrice,
                initTs: obj.initTs
            });
            //console.log("Set latest price", latestPrice);
        }
    }

    useEffect(() => {
        fetchFromIndexApi(`/latestPrice`, 'GET', {}, save, dispatch);
    }, []);

    return [latestPrice];
}
