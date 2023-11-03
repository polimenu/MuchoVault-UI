export const MAIDROP_CONFIG = {
  42161: {
    ManagerContract: "0xF79bdC922C1a27385F0cfC7f24Dd0E7ECE56db05",
    TokenContract: "0x95661b9AB264B3ED86C8634a0045C137AEb10dff",
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