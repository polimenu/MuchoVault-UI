export const V2USER_CONFIG = {
  42161: {
    Plans: [1, 3],
    PremiumPlans: [1],
    MuchoVault: {
      contract: "0x4D46CAe2fff3d06E992e49fc7cB61CD24E77Ef43",
      configDataContract: "0x9e797255a88089954df74405bd70d052199c799c",
      vaults: [0, 1, 2],
      precision: [2, 5, 6],
      amountsForAprSimulation: [{ amount: 1e-6, decimals: 6 }, { amount: 1e-18, decimals: 18 }, { amount: 1e-8, decimals: 8 }],
    },
    MuchoRewardRouter: {
      contracts: ["0x96D395d088C8e053f759F97695Efac4D4b45407A", "0xd67Ba1De34673e17e75Fb4F00D5CC0abCC94Dd53"],
      rewardsToken: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    },
    MuchoBadgeManager: {
      contract: "0x957C225ea6B3B43cB03114613684317Ffb35b862",
    },
    MuchoHub: {
      contract: "0xfeADb28e91337f848ADf3AFC7E0f431c4eebede2",
    },
    MuchoProtocolGmx: {
      contract: "0x9fcB762ddDd71954FBcf67659d68C04Bf42a2c4e",
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
      "0x2eE1Fc67bEC816F3DAe2d2c9409483BEf49F181B", //mUSDC
      "0x01FC279A6339487c4688dF87714609b2138A4d71", //mWETH
      "0xBD5EB7fD3783f504c08Be0a44177BddeE82F991D", //mWBTC
    ],
  },
};


export function getV2AdminContracts(chainId: number) {
  if (!V2USER_CONFIG[chainId]) {
    throw new Error(`Unknown chainId ${chainId}`);
  }
  return V2USER_CONFIG[chainId];
}