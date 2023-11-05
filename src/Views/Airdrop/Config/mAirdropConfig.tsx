export const MAIDROP_CONFIG = {
  42161: {
    ManagerContract: "0x520B3830E9C15C5773149695BE698ea2a5eb8C0c",
    TokenContract: "0xbeeF792aa6c39908144369894c7dC28c7604B893",
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