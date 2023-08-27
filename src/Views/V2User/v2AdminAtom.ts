import { atom } from 'jotai';

export interface IActiveModal {
  title: string;
  vaultInfo: IVaultInfo;
  deposit: boolean;
}

export interface IV2UserAtom {
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
  expectedAPR: number;
  decimals: number;
  totalUSDStaked: number;
  totalStaked: number;
  lastUpdate: Date;
  stakable: boolean;
  depositFee: number;
  withdrawFee: number;
  maxCap: number;
  maxDepositUser: number;
  maxDepositPlans: { planId: number, maxDeposit: number }[];
  userData: { depositTokens: number, muchoTokens: number };
}

export interface IToken {
  name: string;
  contract: string;
  decimals: number;
  supply: number;
  userBalance: number;
}

export interface IMuchoVaultParametersInfo {
  swapFee: number;
  swapFeePlans: [{ planId: number, swapFee: number }];
}

export interface IMuchoVaultContracts {
  muchoHub: string;
  priceFeed: string;
  badgeManager: string;
}

export const v2ContractDataAtom = atom<IV2UserAtom>({
  isModalOpen: false,
  activeModal: null,
});

const v2AdminData = atom<IMuchoVaultData>({ contract: "", vaultsInfo: [], parametersInfo: null, contractsInfo: null });
export const readV2AdminData = atom((get) => get(v2AdminData));
export const writeV2AdminData = atom(null, (get, set, update: IMuchoVaultData) => {
  set(v2AdminData, update);
});