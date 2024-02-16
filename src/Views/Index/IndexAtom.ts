import { atom } from 'jotai';

export interface IActiveModal {
  title: string;
}


export interface IIndexAtom {
  isModalOpen: boolean;
  activeModal: IActiveModal;
  data: IMuchoTokenLauncherData;
}

export const indexAtom = atom<IIndexAtom>({
  isModalOpen: false,
  activeModal: "",
  data: null,
});

export interface IMuchoTokenLauncherData {
  contract: string;
  isOnlyNft: boolean;
  mTokenContract: string;
  mTokenCurrentSupply: number;
  mTokenDecimals: number;
  mTokenVersion: string;
  userBalance: number;
  dateIni: Date;
  dateEnd: Date;
  active: boolean;
  prices: IMuchoIndexDataPrice[];
}

export interface IMuchoIndexDataPrice {
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


const launcherData = atom<IMuchoTokenLauncherData>({
  contract: "", mTokenContract: "", mTokenCurrentSupply: 0, mTokenDecimals: 0, mTokenVersion: "", userBalance: 0, dateIni: new Date(),
  dateEnd: new Date(), active: true, prices: []
});
export const readLauncherData = atom((get) => get(launcherData));
export const writeLauncherData = atom(null, (get, set, update: IMuchoTokenLauncherData) => {
  set(launcherData, update);
});