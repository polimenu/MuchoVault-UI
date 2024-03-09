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

export interface IMuchoTokenMarketData {
  contract: string;
  mTokenContract: string;
  mTokenCurrentSupply: number;
  mTokenDecimals: number;
  userBalance: number;
  active: boolean;
  withdrawFeeUser: number;
  depositFeeUser: number;
  slippage: number;
  buyTokenContract: string;
  buyTokenInWallet: number;
  buyTokenSymbol: string;
  buyTokenDecimals: number;
  sellTokenSymbol: string;
  sellTokenDecimals: number;
  sellTokenContract: string;
  withdrawFee: number;
  depositFee: number;
}

export interface IMuchoIndexOrder {
  orderPosition: number;
  orderType: string;
  orderStatus: string;
  remitant: string;
  amount: number;
  fee: number;
  date: number;
  attempts: number;
  lastAttempt: number;
}

export interface IMuchoIndexMarketComposition {
  asset: string;
  percentage: number
}

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

export interface IMuchoIndexMarketPrice {
  slippage: number;
  buyTokenAddress: string;
  buyTokenSymbol: string;
  buyTokenDecimals: number;
  buyTokenInWallet: number;
  buyTokenPrice: number;
  sellTokenAddress: string;
  sellTokenSymbol: string;
  sellTokenDecimals: number;
  sellTokenInWallet: number;
  sellTokenPrice: number;
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

export interface IIndexPrice {
  price: number;
  buyPrice: number;
  sellPrice: number;
  updated: Date;
  composition: IMuchoIndexMarketComposition[];
  initPrice: number;
  initTs: number;
}


const launcherData = atom<IMuchoTokenLauncherData>({
  contract: "", mTokenContract: "", mTokenCurrentSupply: 0, mTokenDecimals: 0, mTokenVersion: "", userBalance: 0, dateIni: new Date(),
  dateEnd: new Date(), active: true, prices: []
});
export const readLauncherData = atom((get) => get(launcherData));
export const writeLauncherData = atom(null, (get, set, update: IMuchoTokenLauncherData) => {
  set(launcherData, update);
});



const marketData = atom<IMuchoTokenMarketData>({
  contract: "0x0",
  mTokenContract: "0x0",
  mTokenCurrentSupply: 0,
  mTokenDecimals: 0,
  userBalance: 0,
  active: false,
  price: {
    priceUSD: 0,
    slippage: 0,
    buyTokenAddress: "0x0",
    buyTokenSymbol: "",
    buyTokenDecimals: 0,
    buyTokenInWallet: 0,
    buyTokenPrice: 0,
    sellTokenAddress: "0x0",
    sellTokenSymbol: "",
    sellTokenDecimals: 0,
    sellTokenInWallet: 0,
    sellTokenPrice: 0
  },
  initTs: 0,
  initPriceUSD: 0,
  withdrawFeeUser: 0,
  depositFeeUser: 0,
  indexComposition: [
  ]
});
export const readMarketData = atom((get) => get(launcherData));
export const writeMarketData = atom(null, (get, set, update: IMuchoTokenLauncherData) => {
  set(launcherData, update);
});