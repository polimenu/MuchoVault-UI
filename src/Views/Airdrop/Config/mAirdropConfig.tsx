export const MAIDROP_CONFIG = {
  42161: {
    ManagerContract: "0xfAb74DA5AbaAb95A5dE6bF2a364FA2e6143bd7E5",
    //TokenContract: "0xb9aEdEb1F2470F5e1e6f33BC745eAd3E41A55267",
    //TokenContractVersion: "1.1",
    PaymentTokens: [
      {
        TokenPayment: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
        TokenPaymentSymbol: "USDC",
        TokenPaymentDecimals: 6,
      },
      {
        TokenPayment: "0x2eE1Fc67bEC816F3DAe2d2c9409483BEf49F181B",
        TokenPaymentSymbol: "mUSDC",
        TokenPaymentDecimals: 6,
      },
    ],
    OldTokenContracts: [
      {
        contract: "0x7AFdD87FbA836c7862aD7b90bCF50440bF878A3c",
        version: "1.0"
      },
      {
        contract: "0xb9aEdEb1F2470F5e1e6f33BC745eAd3E41A55267",
        version: "1.1",
      }
    ]
  },
};

export const MAIRDROP_FARM_NETWORKS = ["Polygon", "BSC", "zkSync", "Arbitrum", "Optimism", "Avalanche", "Base", "Ethereum"];
export const ORACLES = {
  "MATIC": "0x52099d4523531f678dfc568a7b1e5038aadce1d6",
  "BNB": "0x6970460aabf80c5be983c6b74e5d06dedca95d4a",
  "ETH": "0x639fe6ab55c921f74e7fac1ee960c0b6293ba612",
  "AVAX": "0x8bf61728eedce2f32c456454d87b5d6ed6150208",
}

export const APIFARMURL = (import.meta.env.VITE_APIRAMP_ENV == "production") ? 'https://apiramp.mucho.finance' :
  ((import.meta.env.VITE_APIRAMP_ENV == "staging") ? 'http://ec2-35-180-92-221.eu-west-3.compute.amazonaws.com' : 'http://localhost:3000');

export function getAirdropContracts(chainId: number) {
  if (!MAIDROP_CONFIG[chainId]) {
    throw new Error(`Unknown chainId ${chainId}`);
  }
  return MAIDROP_CONFIG[chainId];
}