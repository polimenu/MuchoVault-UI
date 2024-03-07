export const APIINDEXURL = "http://apiindex.mucho.finance";

export const MINDEX_CONFIG = {
  42161: {
    MarketContract: "0x62f042E8A2eBFF42F19f553794cF87A87342A247",
    BuyToken: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    SellToken: "0x2eE1Fc67bEC816F3DAe2d2c9409483BEf49F181B",
    LauncherContract: "0x24bD2eE4A1deD572bC8161ae686065f99Ba062F2",
    RewardRouterContract: "0xcF3aCfEc02C23885B2E7Ba156d38dF18616135EF",
    RewardBlacklist: ["0"],
    TokenContract: "0x3971203DF7e4846B0f8d7e3a452d336bFBd9a0BF",
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