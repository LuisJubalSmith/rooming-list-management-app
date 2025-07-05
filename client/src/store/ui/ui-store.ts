import { create } from 'zustand';

interface UiState {
  isFilterOpen: boolean;
  openFilter: () => void;
  closeFilter: () => void;
  toggleFilter: () => void;
}

interface RoomingFormStore {
  isVisible: boolean;
  toggleForm: () => void;
}


export const useUiStore = create<UiState>((set) => ({
  isFilterOpen: false,
  openFilter: () => set({ isFilterOpen: true }),
  closeFilter: () => set({ isFilterOpen: false }),
  toggleFilter: () => set((state) => ({ isFilterOpen: !state.isFilterOpen })),
}));

export const useRoomingFormStore = create<RoomingFormStore>((set) => ({
  isVisible: false,
  toggleForm: () => set((state) => ({ isVisible: !state.isVisible })),
}));
