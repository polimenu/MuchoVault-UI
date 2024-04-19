import { atom } from 'jotai';

export interface IPoolsAtom {
    isModalOpen: boolean;
    activeModal: string;
    auxModalData?: any;
    pairAddress?: string;
}

export const poolsAtom = atom<IPoolsAtom>({
    isModalOpen: false,
    activeModal: "",
});

export interface IPoolsData {
    pools?: IPool[];
}

export interface IPool {
    BaseToken: string;// "SOL",
    ChainId: string;//"solana",
    DexId: string;//"orca",
    QuoteToken: string;//"USDC",
    priceNative: number;//"131.4243",
    priceUsd: number;//"131.42",
    Liquidity: number;//6853918.57,
    Volume: number;//107555413.6,
    feeTier: number;//"4000",
    id: string;//"Czfq3xZZDmsdGdUyrNLtRhGc47cXcZtLG4crryfu44zE-20240417150000",
    pairAddress: string;//"Czfq3xZZDmsdGdUyrNLtRhGc47cXcZtLG4crryfu44zE",
    poolAndChainID: string;//"solana-orca",
    poolCategory: string;//"Volatile",
    priceChange: number;//0.29,
    type: string;//"poolData",
    apr: number;//2291.111314676737,
    fees: number;//430221.6544,
    buyTransactions: number;//28798,
    sellTransactions: number;//26715,
    dateTime: number;//"20240417150000"
}



export interface IPoolDetail {
    BaseToken: string;// "SOL",
    ChainId: string;//"solana",
    DexId: string;//"orca",
    QuoteToken: string;//"USDC",
    feeTier: number;//"4000",
    id: string;//"Czfq3xZZDmsdGdUyrNLtRhGc47cXcZtLG4crryfu44zE-20240417150000",
    pairAddress: string;//"Czfq3xZZDmsdGdUyrNLtRhGc47cXcZtLG4crryfu44zE",
    poolAndChainID: string;//"solana-orca",
    poolCategory: string;//"Volatile",
    type: string;//"poolData",
    history: IPoolHistory[];
}

export interface IPoolHistory {
    priceNative: number;//"131.4243",
    priceUsd: number;//"131.42",
    Liquidity: number;//6853918.57,
    Volume: number;//107555413.6,
    priceChange: number;//0.29,apr: number;//2291.111314676737,
    apr: number;//2291.111314676737,
    fees: number;//430221.6544,
    buyTransactions: number;//28798,
    sellTransactions: number;//26715,
    date: number;//"20240417"
}


export const poolsDataAtom = atom<IPoolsData>({});
