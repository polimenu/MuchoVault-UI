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
                composition: [
                    { asset: "WBTC", percentage: 12.8 },
                    { asset: "WETH", percentage: 13.9 },
                    { asset: "SOL", percentage: 25.2 },
                    { asset: "Stablecoin", percentage: 48.1 }
                ],
                initPrice: 1,
                initTs: 1707318159
            });
        }
    }

    useEffect(() => {
        fetchFromIndexApi(`/latestPrice`, 'GET', {}, save, dispatch);
    }, []);

    return [latestPrice];
}
