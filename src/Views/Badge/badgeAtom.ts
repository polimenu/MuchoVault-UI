import { atom } from 'jotai';

interface IActiveModal {
  plan: IPlanDetailed;
}

interface IBadgeAtom {
  isModalOpen: boolean;
  activeModal?: IActiveModal;
  action: string;
}

export const badgeAtom = atom<IBadgeAtom>({
  isModalOpen: false,
  activeModal: null,
});

export const writeBadgeAtom = atom(null, (get, set, update: IBadgeAtom) =>
  set(badgeAtom, update)
);

const badgeData = atom<IPlanDetailed[]>([]);
export const readBadgeData = atom((get) => get(badgeData));
export const writeBadgeData = atom(null, (get, set, update: IPlanDetailed[]) => {
  set(badgeData, update);
});



export interface IPlanAttributes {
  duration: number;
  enabled: boolean;
  nftAddress: string;
  planName: string;
  supply: number;
}

export interface IPlanPricingData {
  userPrice: IPrice;
  publicPrice: IPrice;
  dateIni: Date;
  dateEnd: Date;
  dateRampIni: Date;
  dateRampEnd: Date;
  contract: string;
  priceRampIni: Number;
  priceRampEnd: Number;
}

export interface ITokenIdAttributes {
  expirationTime: Date;
  startTime: Date;
  metaData: {
    rawMetaData: string;
    name: string;
    surname: string;
    email: string;
    discord: string;
  }
  tokenId: number;
  remainingDays: number;
}

export interface IPlanDetailed {
  id: number;
  planAttributes: IPlanAttributes;
  pricing: IPlanPricingData;
  renewalPricing: IPlanPricingData;
  userBalance: number;
  tokenIdAttributes: ITokenIdAttributes;
}


export interface IPrice {
  token: string;
  amount: number;
  contract: string;
  decimals: number;
}
