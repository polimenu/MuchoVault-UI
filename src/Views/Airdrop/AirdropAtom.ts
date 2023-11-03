import { atom } from 'jotai';

export interface IActiveModal {
  title: string;
}

export interface IV2UserAtom {
  isModalOpen: boolean;
  activeModal: IActiveModal;
  data: IMuchoAirdropManagerData;
}

export interface IMuchoAirdropManagerData {
  contract: string;
  mAirdropContract: string;
  mAirdropMaxSupply: number;
  mAirdropCurrentSupply: number;
  mAirdropDecimals: number;
  mAirdropInWallet: number;
  userBalance: number;
  dateIni: Date;
  dateEnd: Date;
  active: boolean;
  price: number;
  priceTokenAddress: string;
  priceTokenSymbol: string;
  priceTokenDecimals: number;
  priceTokenInWallet: number;
}

export interface IPrice {
  paymentToken: IToken;
  amount: number;
}

export interface IToken {
  name: string;
  contract: string;
  decimals: number;
  supply: number;
  userBalance: number;
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