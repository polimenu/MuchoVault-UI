//import { useGlobal } from "@Contexts/Global";
import { IFarmNetwork } from "../AirdropAtom";
import { useEffect, useState } from "react";
import { fetchFromFarmApi } from "./fetch";

export const useGetFarmNetwork = (network: string): (IFarmNetwork[]) => {
    //const { dispatch } = useGlobal();
    const [net, setNet] = useState<IFarmNetwork>();
    const save = (obj: any) => {
        //parse
        console.log("useGetFarmNetwork res", obj);
        if (obj) {
            console.log("changing net");
            setNet(obj);
        }
    }

    useEffect(() => {
        if (network) {
            fetchFromFarmApi(`/airdrop/network`, 'GET', { network }, save, () => { });
        }
    }, [network]);

    return [net];
}