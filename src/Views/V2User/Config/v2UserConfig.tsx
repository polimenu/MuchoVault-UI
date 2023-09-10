export const V2USER_CONFIG = {
  42161: {
    Plans: [1, 3],
    MuchoVault: {
      contract: "0x2421C9FA887891f166cA959DB1CAFd4428cb026d",
      vaults: [0, 1, 2],
      precision: [2, 5, 6],
      amountsForAprSimulation: [{ amount: 1e-6, decimals: 6 }, { amount: 1e-18, decimals: 18 }, { amount: 1e-8, decimals: 8 }],
    },
    MuchoRewardRouter: {
      contract: "0x570C2857CC624077070F7Bb1F10929aad658dA37",
      rewardsToken: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    },
    MuchoBadgeManager: {
      contract: "0xC439d29ee3C7fa237da928AD3A3D6aEcA9aA0717",
    },
    MuchoHub: {
      contract: "0x7832fAb4F1d23754F89F30e5319146D16789c088",
    },
    TokenDictionary: [
      "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", //USDC
      "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8", //USDC.e
      "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1", //DAI
      "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9", //USDT
      "0x17FC002b466eEc40DaE837Fc4bE5c67993ddBd6F", //FRAX
      "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1", //WETH
      "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4", //LINK
      "0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0", //UNI
      "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f", //wBTC
      "0x8AAAF1907E28719E22396a5cf738FC3B5C10a5b9", //mUSDC
      "0x29B8a90823F39c6DcbFBf5AE10B8B1821883aF5a", //mWETH
      "0xe6D0a4C4EC52e87FfF879E65e616B9e9175c9232", //mWBTC
    ]
  },
};


export function getV2AdminContracts(chainId: number) {
  if (!V2USER_CONFIG[chainId]) {
    throw new Error(`Unknown chainId ${chainId}`);
  }
  return V2USER_CONFIG[chainId];
}