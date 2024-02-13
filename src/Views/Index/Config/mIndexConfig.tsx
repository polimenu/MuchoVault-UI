export const MINDEX_CONFIG = {
  42161: {
    LauncherContract: "0x4a2F1f57B0151aD2a11fa238491c055bEdD7eAb3",
    RewardRouterContract: "0xcF3aCfEc02C23885B2E7Ba156d38dF18616135EF",
    RewardBlacklist: ["0"],
    TokenContract: "0x95279C2A8790b66a11f9def12c7A355C0CFfBD7f",
    //TokenContractVersion: "1.1",
    PaymentTokens: [
      {
        TokenPayment: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
        TokenPaymentSymbol: "USDC",
        TokenPaymentDecimals: 6,
      },
      {
        TokenPayment: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
        TokenPaymentSymbol: "USDT",
        TokenPaymentDecimals: 6,
      },
    ],
    OldTokenContracts: [
    ]
  },
};


export function getIndexContracts(chainId: number) {
  if (!MINDEX_CONFIG[chainId]) {
    throw new Error(`Unknown chainId ${chainId}`);
  }
  return MINDEX_CONFIG[chainId];
}

//dateini 1707934740