
//import { createHash } from 'crypto';

export const RAMP_CONFIG = {
    DelayTransactionsRefreshSeconds: 10,
    AllowedFiatCurrencies: ["EUR"],
    RampPlanContract: "0xe13bA2013c78C6DaCFfC6964e76138a4E8dAC731",
    PremiumPlans: [1],
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
    ]
};


export const APIRAMPURL = (import.meta.env.VITE_APIRAMP_ENV == "production") ? 'https://apiramp.mucho.finance' :
    ((import.meta.env.VITE_APIRAMP_ENV == "staging") ? 'http://ec2-35-180-92-221.eu-west-3.compute.amazonaws.com' : 'http://localhost:3000');