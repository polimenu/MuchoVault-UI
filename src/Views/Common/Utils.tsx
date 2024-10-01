export const contractLink = (contract: string, name: string) => {
    return <a href={`https://arbiscan.io/address/${contract}`} target="_blank">{name ? name : addressSummary(contract) + "..."}</a>;
}

export const addressSummary = (address: string) => {
    return address ? address.substring(0, 10) + "..." + address.substring(address.length - 10, address.length) : "";
}

export const dateFormat = (date: Date) => {
    return date.toISOString().split('T')[0] + " " + date.toLocaleTimeString("es-ES");
}

export const fromDateYYYYMMDDhhmmss = (dt: string) => {
    return new Date(dt.substring(0, 4), dt.substring(5, 7) - 1, dt.substring(8, 10), dt.substring(11, 13), dt.substring(14, 16), dt.substring(17, 19));
}


export const NULL_ACCOUNT = "0x0000000000000000000000000000000000000000";

export const filterStrangeCharacters = (str: string) => {
    //all latin letters (A-Z, a-z) and numbers (0-9) - special characters: ./,()'- # and space
    return str.normalize("NFC").replaceAll(/[^ÁÉÍÓÚÀÈÌÒÙáéíóúàèìòùÏÜïüÑñA-Za-z0-9\.,/()'\-# ]/g, " ");
}