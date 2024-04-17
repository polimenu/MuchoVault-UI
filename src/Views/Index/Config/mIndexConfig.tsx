export const APIINDEXURL = "https://apiindex.mucho.finance";

export const MINDEX_CONFIG = {
  42161: {
    MarketContract: "0x02bb0E2E25d1Ce4Ef3f977161E0501d610bC6f80",
    BuyQueueContract: "0x950E9fB5F8fC14d7c28a4AccA6344612D0859053",
    DecimalsBuyToken: 6,
    DecimalsIndexToken: 6,
    SellQueueContract: "0x6d2C6F6AA05d8c88d8Df1f6544DAa523425f9A05",
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