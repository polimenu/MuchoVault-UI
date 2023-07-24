import { atom } from 'jotai';

export interface IActiveModal {
  contract: string;
  parameterName: string;
  currentValue: string;
}

export interface IV2ContractData {
  isModalOpen: boolean;
  activeModal: IActiveModal;
  muchoVault: IMuchoVaultData;
}

export interface IMuchoVaultData {
  contract: string;
  vaultsInfo: IVaultInfo[];
  parametersInfo: IMuchoVaultParametersInfo;
}

export interface IVaultInfo {
  depositToken: IToken;
  muchoToken: IToken;
  totalStaked: number;
  lastUpdate: Date;
  stakable: boolean;
  depositFee: number;
  withdrawFee: number;
  maxCap: number;
  maxDepositUser: number;
}

export interface IToken {
  name: string;
  contract: string;
}

export interface IMuchoVaultParametersInfo {
  ownerFee: number;
  swapFee: number;
  earningsAddress: string;
}

export const v2ContractDataAtom = atom<IV2ContractData>({
  isModalOpen: false,
  activeModal: null,
  muchoVault: null,
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