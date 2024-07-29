import { useEffect, useState } from 'react';
import { ITokenIdAttributes } from '../badgeAtom';
import { useGlobal } from '@Contexts/Global';
import { fetchFromIndexApi } from '@Views/Index/Hooks/fetch';


export const useGetTokenIdAttributes = (nftAddress: string, tokenId: number) => {
    const pwd = import.meta.env.VITE_TID_PWD;
    const { dispatch } = useGlobal();
    const [tokenIdAttributes, setTokenIdAttributes] = useState<ITokenIdAttributes>();

    const save = (obj: any) => {
        if (obj && obj.tokenIdAttributes) {
            console.log("Setting tokenIdAttributes", obj);
            setTokenIdAttributes({
                expirationTime: new Date(obj.tokenIdAttributes.expirationTime * 1000),
                startTime: new Date(obj.tokenIdAttributes.startTime * 1000),
                tokenId: obj.tokenIdAttributes.tokenId,
                metaData: obj.tokenIdAttributes.metaData,
            });
            console.log("Set tokenIdAttributes", tokenIdAttributes);
        }
    }

    useEffect(() => {
        if (nftAddress && tokenId > 0) {
            console.log("CALLING GET TOKEN ID ATTRIBUTES");
            fetchFromIndexApi(`/tokenIdAttributes`, 'GET', { pwd, tid: tokenId, nft: nftAddress }, save, dispatch);
        }
    }, [nftAddress, tokenId]);

    return [tokenIdAttributes];
}
