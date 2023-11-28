export const contractLink = (contract: string, name: string) => {
    return <a href={`https://arbiscan.io/address/${contract}`} target="_blank">{name ? name : addressSummary(contract) + "..."}</a>;
}

export const addressSummary = (address: string) => {
    return address.substring(0, 10) + "..." + address.substring(address.length - 10, address.length);
}