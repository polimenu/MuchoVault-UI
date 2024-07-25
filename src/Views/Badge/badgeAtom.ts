import { atom } from 'jotai';

interface IActiveModal {
  plan: IPlan;
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

const badgeData = atom<IBadge>({ plans: null });
export const readBadgeData = atom((get) => get(badgeData));
export const writeBadgeData = atom(null, (get, set, update: IBadge) => {
  set(badgeData, update);
});


export interface IPlan {
  id: number;
  name: string;
  uri: string;
  subscribers: number;
  subscriptionPrice: IPrice;
  renewalPrice: IPrice;
  time: Date;
  exists: boolean;
  enabled: boolean;
  status: string;
  isActiveForCurrentUser: boolean;
  address: string;
  subscriptionPricing: IPricing;
  renewalPricing: IPricing;
}

export interface IPricing {
  contract: string,
  dateIni: Date,
  dateEnd: Date,
  dateRampIni: Date,
  dateRampEnd: Date,
  priceRampIni: Number,
  priceRampEnd: Number,
  token: string,
  tokenSymbol: string,
  tokenDecimals: Number
}

export interface IPrice {
  token: string;
  amount: number;
  contract: string;
  decimals: number;
}

export interface IBadge {
  plans?: [
    plan?: IPlan,
  ];
}

