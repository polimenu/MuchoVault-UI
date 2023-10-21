import { atom } from 'jotai';
import { V2AdminContract } from '.';

export interface IMuchoProtocolGmxData {
  contract: string;
  protocolName: string;
  protocolDescription: string;
  totalUSDStaked: number;
  totalUSDBacked: number;
  glpApr: number;
  glpWethMintFee: number;
  slippage: number;
  earningsAddress: string;
  claimEsGmx: boolean;

  minNotInvestedPercentage: number;
  desiredNotInvestedPercentage: number;
  minBasisPointsMove: number;
  maxRefreshWeightLapse: number;
  manualModeWeights: boolean;
  rewardSplit: {
    ownerPercentage: number;
    NftPercentage: number;
  };
  compoundProtocol: string;

  contracts: {
    EsGMX: string;
    fsGLP: string;
    WETH: string;
    glpRouter: string;
    glpRewardRouter: string;
    poolGLP: string;
    glpVault: string;
    muchoRewardRouter: string;
    priceFeed: string;
  }

  tokenInfo: IGmxTokenInfo[]
}

export interface IGmxTokenInfo {
  token: IToken;
  secondaryTokens: IToken[];
  staked: number;
  invested: number;
  notInvested: number;
  desiredWeight: number;
  investedWeight: number;
}

export interface IMuchoHubData {
  contract: string;
  protocols: { name: string, address: string }[];
  tokensInfo: IHubTokenInfo[];
}

export interface IHubTokenInfo {
  token: IToken;
  totalStaked: number;
  totalNotInvested: number;
  defaultInvestment: [{
    protocol: { name: string; address: string; };
    percentage: number;
  }];
  currentInvestment: [{
    protocol: { name: string; address: string; };
    amount: number;
  }]
}

export interface IActiveModal {
  title: string;
  functionName: string;
  args: any[];
  currentValue: any;
  validations: Function;
  unit: string;
  contract: V2AdminContract;
}

export interface IV2AdminAtom {
  isModalOpen: boolean;
  activeModal: IActiveModal;
}

export interface IMuchoVaultData {
  contract: string;
  vaultsInfo: IVaultInfo[];
  parametersInfo: IMuchoVaultParametersInfo;
  contractsInfo: IMuchoVaultContractsInfo;
}

export interface IMuchoVaultContractsInfo {
  muchoHub: string;
  priceFeed: string;
  badgeManager: string;
}

export interface IVaultInfo {
  id: number;
  depositToken: IToken;
  muchoToken: IToken;
  decimals: number;
  totalStaked: number;
  lastUpdate: Date;
  stakable: boolean;
  depositFee: number;
  withdrawFee: number;
  maxCap: number;
  maxDepositUser: number;
  maxDepositPlans: [{ planId: number, maxDeposit: number }];
}

export interface IToken {
  name: string;
  contract: string;
  decimals: number;
}

export interface IMuchoVaultParametersInfo {
  swapFee: number;
  swapFeePlans: [{ planId: number, swapFee: number }];
  earningsAddress: string;
  totalUSDStaked: number;
}

export interface IMuchoVaultContracts {
  muchoHub: string;
  priceFeed: string;
  badgeManager: string;
}

export const v2ContractDataAtom = atom<IV2AdminAtom>({
  isModalOpen: false,
  activeModal: null,
});

const v2AdminData = atom<IMuchoVaultData>({ contract: "", vaultsInfo: [], parametersInfo: null, contractsInfo: null });
export const readV2AdminData = atom((get) => get(v2AdminData));
export const writeV2AdminData = atom(null, (get, set, update: IMuchoVaultData) => {
  set(v2AdminData, update);
});

/*
export const writeBadgeAtom = atom(null, (get, set, update: IBadgeAtom) =>
  set(badgeAtom, update)
);

const badgeData = atom<IV2ContractData>({ plans: null });
export const readBadgeData = atom((get) => get(badgeData));
export const writeBadgeData = atom(null, (get, set, update: IV2ContractData) => {
  set(badgeData, update);
});

*/