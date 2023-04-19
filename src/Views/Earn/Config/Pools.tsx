export const EARN_CONFIG = {
  42161: {
    MuchoVault: '0x95a020C76bDbE38d64F78C330F6364BD0429829E',
    POOLS: [
      {
        token: { symbol: "USDC", address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8" },
        mToken: { symbol: "muchoUSDC", address: "0xDBc123bE93C27c90005c87d6DFC5562d42684f13" },
        precision: 2,
        decimals: 6,
      },
      {
        token: { symbol: "WETH", address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1" },
        mToken: { symbol: "muchoETH", address: "0xba61F3Fbd8E2e425Da9714b0f9590d48109D7A46" },
        precision: 5,
        decimals: 18,
      },
      {
        token: { symbol: "WBTC", address: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f" },
        mToken: { symbol: "muchoBTC", address: "0x7BFb65088BDdcDd75b5D88D4810bf342C48dbb7f" },
        precision: 6,
        decimals: 10,
      },
      /*{
        token: { symbol: "USDT", address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9" },
        mToken: { symbol: "muchoUSDT", address: "0x43D199BB9d5e32f8559d38F8F652Cf07AA75da60" },
        precision: 2,
        decimals: 6,
      },*/
    ],
  },
};

export function getMuchoVaultContract(chainId) {
  if (!EARN_CONFIG[chainId]) {
    throw new Error(`Unknown chainId ${chainId}`);
  }
  return EARN_CONFIG[chainId].MuchoVault;
}
