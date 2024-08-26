import { create } from 'zustand';

export type DrawerState = {
    open: boolean;
    handleDrawer: () => void;
}

const useDrawerStore = create<DrawerState>((set) => ({
    open: false,
    handleDrawer: () => set((state) => ({ open: !state.open })),
}));

export default useDrawerStore;
