export const MAIDROP_CONFIG = {
  42161: {
    ManagerContract: "0xd68391b25EaDA08b3b3DF5A7f94806f7dbbed819",
    TokenContract: "0x96b8627b98232A767A0aC3f3bC5A0567f3156F16",
    PaymentTokens: [{
      TokenPayment: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
      TokenPaymentSymbol: "USDC",
      TokenPaymentDecimals: 6,
    }, {
      TokenPayment: "0x2eE1Fc67bEC816F3DAe2d2c9409483BEf49F181B",
      TokenPaymentSymbol: "mUSDC",
      TokenPaymentDecimals: 6,
    },]
  },
};


export function getAirdropContracts(chainId: number) {
  if (!MAIDROP_CONFIG[chainId]) {
    throw new Error(`Unknown chainId ${chainId}`);
  }
  return MAIDROP_CONFIG[chainId];
}