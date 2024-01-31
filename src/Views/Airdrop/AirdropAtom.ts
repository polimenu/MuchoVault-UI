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
  mAirdropVersion: string;
  userBalance: number;
  dateIni: Date;
  dateEnd: Date;
  active: boolean;
  prices: IMuchoAirdropDataPrice[];
  oldTokens: IOldAirdropData[];
  distributions: IMuchoAirdropDistribution[];
}

export interface IMuchoAirdropDistribution {
  id: number;
  name: string;
  token: string;
  totalTokens: number;
  userTokensByMAirdrop: number;
  userTokensByNFT: number;
  expirationDate: Date;
  precision: number;
  claimed: boolean;
}

export interface IOldAirdropData {
  maxSupply: number;
  totalSupply: number;
  userBalance: number;
  version: string;
}

export interface IMuchoAirdropDataPrice {
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


export interface IFarmNetworkBriefing {
  network: string;
  nativeToken: string;
  lastUpdate: string;
  balances: any;
}

export interface IFarmNetwork {
  network: string;
  nativeToken: string;
  lastUpdate: string;
  wallets: IFarmWallet[];
}

export interface IFarmWallet {
  wallet: string;
  name: string;
  nativeBalance: number;
  balances: IFarmBalance[];
}

export interface IFarmBalance {
  token: string;
  balance: number;
}