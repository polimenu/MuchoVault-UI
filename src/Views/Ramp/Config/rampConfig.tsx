
//import { createHash } from 'crypto';

export const RAMP_CONFIG = {
    AllowedFiatCurrencies: ["EUR"],
    AllowedOffRampTokens: [
        {
            address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
            symbol: "USDC.e",
            decimals: 6
        },
        {
            address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
            symbol: "USDC",
            decimals: 6
        },
        {
            address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
            symbol: "USDT",
            decimals: 6
        },
    ],
    AdminMails: ["hola@soypepediaz.com", "alfredo83@gmail.com"]//.map(e => createHash("md5").update(e).digest("hex"))
};




//export const APIRAMPURL = 'http://ec2-35-180-92-221.eu-west-3.compute.amazonaws.com';
export const APIRAMPURL = 'http://localhost:3000';
//export const APIRAMPURL = 'https://apiramp.mucho.finance';