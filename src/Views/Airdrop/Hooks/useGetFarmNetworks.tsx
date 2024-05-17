//import { useGlobal } from "@Contexts/Global";
import { IFarmNetwork, IFarmNetworkBriefing } from "../AirdropAtom";
import { useContext, useEffect, useState } from "react";
import { fetchFromFarmApi } from "./fetch";
import { Chain, useContractReads } from "wagmi";
import { ViewContext } from "..";
import { MAIDROP_CONFIG, ORACLES } from "../Config/mAirdropConfig";
import ChainLinkAbi from "../Config/Abis/Chainlink.json";
import { getBNtoStringCopy } from "@Utils/useReadCall";
import { getDataNumber } from "./useCommonUtils";

export const useGetFarmNetwork = (network: string): (IFarmNetwork[]) => {
    //const { dispatch } = useGlobal();
    const [net, setNet] = useState<IFarmNetwork>();
    const save = (obj: any) => {
        //parse
        //console.log("useGetFarmNetwork res", obj);
        if (obj) {
            //console.log("changing net");
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

export const useGetFarmNetworksBriefing = (wallet: string): (IFarmNetworkBriefing[][]) => {
    //const { dispatch } = useGlobal();
    const [net, setNet] = useState<IFarmNetworkBriefing[]>();
    const save = (obj: any) => {
        //parse
        //console.log("useGetFarmNetworksBriefing res", obj);
        if (obj) {
            //console.log("changing net");
            setNet(obj);
        }
    }

    useEffect(() => {
        fetchFromFarmApi(`/airdrop/allnetworks`, 'GET', { wallet }, save, () => { });
    }, [wallet]);

    return [net];
}

export const useGetPrices = () => {
    let activeChain: Chain | null = null;
    const contextValue = useContext(ViewContext);
    if (contextValue) {
        activeChain = contextValue.activeChain;
    }

    let calls = [];
    for (let t in ORACLES) {
        calls.push({
            address: ORACLES[t],
            abi: ChainLinkAbi,
            functionName: 'latestAnswer',
            args: [],
            chainId: activeChain?.id,
            map: t
        });

        calls.push({
            address: ORACLES[t],
            abi: ChainLinkAbi,
            functionName: 'decimals',
            args: [],
            chainId: activeChain?.id,
            map: `${t}_decimals`
        });
    }

    let indexes: any = {};
    calls.forEach((c, i) => { indexes[c.map] = i; });

    //console.log("Calls", calls);
    //console.log("indexes", indexes);

    let { data } = useContractReads({
        contracts: calls,
        watch: true,
    });
    data = getBNtoStringCopy(data);


    const res = {};
    if (data && data[0]) {
        //console.log("DATA!!", data);
        data.indexes = indexes;

        for (let t in ORACLES) {
            res[t] = getDataNumber(data, t) / (10 ** getDataNumber(data, `${t}_decimals`));
        }
    }

    return res;
}