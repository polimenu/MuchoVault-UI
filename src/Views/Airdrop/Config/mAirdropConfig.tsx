export const MAIDROP_CONFIG = {
  42161: {
    ManagerContract: "0xfAb74DA5AbaAb95A5dE6bF2a364FA2e6143bd7E5",
    TokenContract: "0xb9aEdEb1F2470F5e1e6f33BC745eAd3E41A55267",
    TokenContractVersion: "1.1",
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
      }
    ]
  },
};


export function getAirdropContracts(chainId: number) {
  if (!MAIDROP_CONFIG[chainId]) {
    throw new Error(`Unknown chainId ${chainId}`);
  }
  return MAIDROP_CONFIG[chainId];
}