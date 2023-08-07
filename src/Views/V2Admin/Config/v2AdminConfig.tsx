export const V2ADMIN_CONFIG = {
  42161: {
    Plans: [1, 3],
    MuchoVault: {
      contract: "0xC598B8b0F6492068C9dE5f3737B922E0c7D5FF83",
      vaults: [{ id: 0, depositTokenName: "USDC", muchoTokenName: "mUSDC", decimals: 6, },
      { id: 1, depositTokenName: "WETH", muchoTokenName: "mWETH", decimals: 18, },
      { id: 2, depositTokenName: "WBTC", muchoTokenName: "mWBTC", decimals: 8, },
      ],
    },
    MuchoHub: {
      contract: "0xC223A6A5f1e8E0DCEF7Ed96277FEFFD5Be50Db81",
      tokens: [
        {
          contract: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
          name: "USDC",
          decimals: 6,
        }, {
          contract: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
          name: "WETH",
          decimals: 18,
        },
        {
          contract: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
          name: "WBTC",
          decimals: 8
        }
      ]
    },
    MuchoRewardRouter: {
      contract: "0x570C2857CC624077070F7Bb1F10929aad658dA37",
    },
  },
};


export function getV2AdminContracts(chainId: number) {
  if (!V2ADMIN_CONFIG[chainId]) {
    throw new Error(`Unknown chainId ${chainId}`);
  }
  return V2ADMIN_CONFIG[chainId];
}