export const MAIDROP_CONFIG = {
  42161: {
    ManagerContract: "0xd68391b25EaDA08b3b3DF5A7f94806f7dbbed819",
    TokenContract: "0xF13a92cd15FC4ed9DE60C5BF5468606dFA688b89",
    TokenPayment: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    TokenPaymentSymbol: "USDC",
    TokenPaymentDecimals: 6,
  },
};


export function getAirdropContracts(chainId: number) {
  if (!MAIDROP_CONFIG[chainId]) {
    throw new Error(`Unknown chainId ${chainId}`);
  }
  return MAIDROP_CONFIG[chainId];
}