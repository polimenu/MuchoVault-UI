import { useGlobal } from "@Contexts/Global";
import { asyncFetchFromIndexApi, fetchFromIndexApi } from "@Views/Index/Hooks/fetch";
import { useEffect, useState } from "react";


export const useGetEncryptedMetadata = (metadata: string) => {
    const { dispatch } = useGlobal();
    const [encryptedMetadata, setEncryptedMetadata] = useState("");

    const save = (obj: any) => {
        if (obj.data) {
            setEncryptedMetadata(obj.data);
        }
    }

    useEffect(() => {
        fetchFromIndexApi(`/encryptMetadata`, 'GET', { data: metadata }, save, dispatch);
    }, [metadata]);

    return [encryptedMetadata];
}

export const getEncryptedMetadata = async (metadata: string, dispatch: any) => {
    //const { dispatch } = useGlobal();
    const res = await asyncFetchFromIndexApi(`/encryptMetadata`, 'GET', { data: metadata }, dispatch);

    return res.data;
}