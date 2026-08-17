import { create } from "zustand";

type ResetProgressModalState = {
    isOpen: boolean;
    open: () => void;
    close: () => void;
};

export const useResetProgressModal = create<ResetProgressModalState>((set) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
}));
