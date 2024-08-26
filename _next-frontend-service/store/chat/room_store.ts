import { create } from 'zustand';

export type RoomState = {
    createRoomModal: boolean;
    addUserToRoom: {
        open: boolean;
        roomId: number;
    };
    handleCreateRoomModal: () => void;
    handleAddUserToRoom: (state: {
        open: boolean;
        roomId: number;
    }) => void;
}

const useRoomStore = create<RoomState>((set) => ({
    createRoomModal: false,
    addUserToRoom: { open: false, roomId: 0, },
    handleCreateRoomModal: () => set((state) => ({ createRoomModal: !state.createRoomModal })),
    handleAddUserToRoom: (state) => set(() => ({ addUserToRoom: state })),
}));

export default useRoomStore;
