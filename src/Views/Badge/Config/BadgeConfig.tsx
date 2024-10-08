export const BADGE_CONFIG = {
  42161: {
    MuchoNFTFetcher: '0xBA3EacD2afADD1C38b940A461c48540c77a121d3',
    MuchoRewardRouter: '0x96D395d088C8e053f759F97695Efac4D4b45407A',
    MuchoBadgeWrapper: '0xA5d616D7A572F7eD9B8c90FaC8a5f62ec827f1c0',
    MuchoNFTReader: "0x8e430eCBa7f81085d41C8757eC8Aa16Fbd32b2c2",
  },
};

export const BLACKLISTED_NFT = [7];

export const VALID_TOKENS = {
  "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8": {
    contract: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
    symbol: "USDC.e",
    decimals: 6
  },
  "0xaf88d065e77c8cC2239327C5EDb3A432268e5831": {
    contract: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    symbol: "USDC",
    decimals: 6
  },
  "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9": {
    contract: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
    symbol: "USDT",
    decimals: 6
  },
  "0x0000000000000000000000000000000000000000": {
    contract: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    symbol: "USDC",
    decimals: 6
  },
};

export function getMuchoBadgeContract(chainId: number) {
  if (!BADGE_CONFIG[chainId]) {
    throw new Error(`Unknown chainId ${chainId}`);
  }
  return BADGE_CONFIG[chainId].MuchoVault;
}
