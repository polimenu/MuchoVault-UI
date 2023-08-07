import { atom } from 'jotai';

export interface IActiveModal {
  title: string;
  functionName: string;
  args: any[];
  currentValue: any;
  validations: Function;
  unit: string;
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
}

export interface IMuchoVaultParametersInfo {
  swapFee: number;
  swapFeePlans: [{ planId: number, swapFee: number }];
  earningsAddress: string;
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