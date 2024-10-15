import { atom } from 'jotai';

export interface ILead {
    email: string;
    moosendId: string;
    name: string;
    surname: string;
    subscriptionDate: Date;
    subscriptionStatus: string;
    subscriptionTS: number;
    unsubscriptionDate?: Date;
    lastUpdate: Date;
    lastUpdateTs: number;
    plans?: ILeadPlan[];
}

export interface ILeadPlan {
    planName: string;
    nftAddress: string;
    userAddress: string;
    tokenId: number;
    startTime: Date;
    expirationTime: Date;
    startTimeTs: number;
    expirationTimeTs: number;
}

export interface IUserAtom {
    isModalOpen: boolean;
    activeModal: string;
    auxModalData?: any;
}

export const usersAtom = atom<IUserAtom>({
    isModalOpen: false,
    activeModal: "",
});