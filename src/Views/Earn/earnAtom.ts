import { atom } from 'jotai';

interface IActiveModal {
  poolInfo: IPoolInfo;
  primaryToken: string;
  vaultId: number;
  decimals: number;
  deposit: boolean;
  precision: number;
}

interface IEarnAtom {
  isModalOpen: boolean;
  activeModal: IActiveModal;
}

export const earnAtom = atom<IEarnAtom>({
  isModalOpen: false,
  activeModal: null,
});

export const writeEarnAtom = atom(null, (get, set, update: IEarnAtom) =>
  set(earnAtom, update)
);

const earnData = atom<IEarn>({ earn: null });
export const readEarnData = atom((get) => get(earnData));
export const writeEarnData = atom(null, (get, set, update: IEarn) => {
  set(earnData, update);
});

interface ITooltip {
  key: string;
  value: string;
}
interface IApr {
  description: string;
  tooltip: ITooltip[];
  value: string;
}

export interface IPoolInfo {
  APR: string;
  EarnRateSec: string;
  GDlptoken: string;
  glpFees: string;
  lastUpdate: string;
  lpToken: string;
  rewardStart: boolean;
  stakable: boolean;
  totalStaked: string;
  vaultcap: string;
  withdrawable: boolean;
  muchoTotalSupply: string;
  userAvailableInWallet: string;
  userMuchoInWallet: string;
  exchangeUSD: string;
  totalStakedUSD: string;
}

export interface IProtocolInfo {
  TVL: string;
  GLP: string;
  GLPNeeded: string;
  GLPtoUSD: string;
}

export interface IEarn {
  ProtocolInfo?: IProtocolInfo;
  earn?: [
    poolinfo: IPoolInfo,
  ];
}

