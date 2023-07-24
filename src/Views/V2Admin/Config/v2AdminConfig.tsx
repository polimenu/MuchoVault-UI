export const V2ADMIN_CONFIG = {
  42161: {
    MuchoVault: {
      contract: "0xc36b02374fd0537A830fCa4781F63E5884A76564",
      vaults: [0],
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