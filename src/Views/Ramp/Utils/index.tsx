export const networkBeautify = (network: string): string => {
    if (!network)
        return '';

    if (network == "mainnet")
        return "Ethereum";

    return network.charAt(0).toUpperCase() + network.slice(1);
}

export const tokenBeautify = (token: string): string => {
    if (!token)
        return '';

    if (token == "usdce")
        return "USDC.e";

    if (token.toLowerCase() == token)
        return token.toUpperCase();

    return token;
}



export const formatDate = (ts: number) => {
    try {
        return (new Date(Number(ts))).toISOString().replaceAll("T", " ").replaceAll("Z", " ").substring(0, 19);
    }
    catch (e) {
        //console.log("Imposible to parse ts", ts);
        return "";
    }
}