export const V2ADMIN_CONFIG = {
  42161: {
    Plans: [1, 3],
    MuchoVault: {
      contract: "0xC598B8b0F6492068C9dE5f3737B922E0c7D5FF83",
      vaults: [0, 1, 2],
    },
    MuchoHub: {
      contract: "0xC223A6A5f1e8E0DCEF7Ed96277FEFFD5Be50Db81",
      tokens: ["0xaf88d065e77c8cC2239327C5EDb3A432268e5831", //USDC
        "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1", //WETH
        "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f", //WBTC
      ]
    },
    MuchoRewardRouter: {
      contract: "0x570C2857CC624077070F7Bb1F10929aad658dA37",
    },
    MuchoProtocolGmx: {
      contract: "0x7B3585C7b35EFB540FA2684Ba8D288Cd46F18E78",
    },
  },
};


export function getV2AdminContracts(chainId: number) {
  if (!V2ADMIN_CONFIG[chainId]) {
    throw new Error(`Unknown chainId ${chainId}`);
  }
  return V2ADMIN_CONFIG[chainId];
}