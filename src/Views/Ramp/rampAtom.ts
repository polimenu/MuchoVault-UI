import { atom } from 'jotai';

export interface IRampAtom {
    isModalOpen: boolean;
    activeModal: string;
    auxModalData?: any;
    sessionId?: string;
}

export const rampAtom = atom<IRampAtom>({
    isModalOpen: false,
    activeModal: "",
});