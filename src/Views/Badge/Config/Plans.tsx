export const BADGE_CONFIG = {
  42161: {
    MuchoBadgeManager: '0xe47313ebad05954bD2C1388c8a28fA53d637c1ac',
  },
};

export function getMuchoBadgeContract(chainId: number) {
  if (!BADGE_CONFIG[chainId]) {
    throw new Error(`Unknown chainId ${chainId}`);
  }
  return BADGE_CONFIG[chainId].MuchoVault;
}
