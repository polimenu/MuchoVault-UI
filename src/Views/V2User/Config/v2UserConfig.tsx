export const V2USER_CONFIG = {
  42161: {
    Plans: [1, 3],
    MuchoVault: {
      contract: "0xC598B8b0F6492068C9dE5f3737B922E0c7D5FF83",
      vaults: [0, 1, 2],
      amountsForAprSimulation: [100, 0.1, 0.01],
    },
    MuchoHub: {
      contract: "0xC223A6A5f1e8E0DCEF7Ed96277FEFFD5Be50Db81",
    }
  },
};


export function getV2AdminContracts(chainId: number) {
  if (!V2USER_CONFIG[chainId]) {
    throw new Error(`Unknown chainId ${chainId}`);
  }
  return V2USER_CONFIG[chainId];
}