export const V2ADMIN_CONFIG = {
  42161: {
    MuchoVault: {
      contract: "0x5a60876DE5be83E1101BA73F713F8FA5F10ad7a4",
      vaults: [{ id: 0, depositTokenName: "USDC", muchoTokenName: "mUSDC", decimals: 6, },
      { id: 1, depositTokenName: "WETH", muchoTokenName: "mWETH", decimals: 18, },
      { id: 2, depositTokenName: "WBTC", muchoTokenName: "mWBTC", decimals: 8, },
      ],
    },
    MuchoHub: {
      contract: "0xC223A6A5f1e8E0DCEF7Ed96277FEFFD5Be50Db81",
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