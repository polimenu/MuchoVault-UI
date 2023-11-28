import { atom } from 'jotai';

export enum ERampStatus {
    NOT_LOGGED,
    OTP_SENT,
    LOGGED,
    SUMSUB,
}

export interface IRampAtom {
    isModalOpen: boolean;
    activeModal: string;
    auxModalData?: any;
    rampData?: IRampData;
    loginStatus: ERampStatus;
    sessionId?: string;
    email?: string;
    sumsubToken?: string;
}

export const rampAtom = atom<IRampAtom>({
    isModalOpen: false,
    activeModal: "",
    loginStatus: ERampStatus.NOT_LOGGED,
});

export interface IRampData {
    userDetails?: IRampUserDetails;
    tokenPreferences?: IRampTokenPreference[];
    transactions?: IRampTransaction[];
    allowedCurrencies?: IRampCurrency[];
    allowedCountries?: IRampCountry[];
    bankAccounts?: IRampBankAccount[];
}

export interface IRampBankAccount {
    uuid: string;
    isMain: boolean;
    iban: string;
    currency: string;
}

export const rampDataAtom = atom<IRampData>({});

export interface IRampUserDetails {
    address: {
        address_line_1: string;
        city: string;
        address_line_2: string;
        country: string;
        post_code: string;
    };
    date_of_birth: string;
    target_address: string;
    email: string;
    first_name: string;
    last_name: string;
    status: string;
    kyc_status: {
        status: string;
        explanation: string;
        canTransact: boolean;
    }
    uuid: string;
    bvn: string;
    canCreateKYC: boolean;
}

export interface IRampTokenPreference {
    currency: string;
    chain: string;
    token: string;
}

export interface IRampTransaction {
    status: string,
    user_uuid: string,
    direction: string,
    input: {
        amount: number,
        currency: string,
        transaction_id: string
    },
    output: { currency: string }
}

export interface IRampCurrency {
    currency_name: string;
    currency_label: string;
    network_name?: string[];
}

export interface IRampCountry {
    country_name: string;
    country_symbol: string;
}