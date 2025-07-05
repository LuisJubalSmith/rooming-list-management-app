import { create } from 'zustand';

/**
 * UI State Store
 * Manages the state of UI components like the Filter dropdown.
 */
interface UiState {
  isFilterOpen: boolean;            // Controls visibility of the filter dropdown
  openFilter: () => void;          // Opens the filter
  closeFilter: () => void;         // Closes the filter
  toggleFilter: () => void;        // Toggles the filter state
}

/**
 * Rooming Form State Store
 * Manages the visibility of the Rooming List creation form.
 */
interface RoomingFormStore {
  isVisible: boolean;              // Controls visibility of the RoomingForm
  toggleForm: () => void;         // Toggles form visibility
}

// Zustand store to manage the filter dropdown state
export const useUiStore = create<UiState>((set) => ({
  isFilterOpen: false,
  openFilter: () => set({ isFilterOpen: true }),
  closeFilter: () => set({ isFilterOpen: false }),
  toggleFilter: () => set((state) => ({ isFilterOpen: !state.isFilterOpen })),
}));

// Zustand store to manage visibility of the Rooming List creation form
export const useRoomingFormStore = create<RoomingFormStore>((set) => ({
  isVisible: false,
  toggleForm: () => set((state) => ({ isVisible: !state.isVisible })),
}));
