import { create } from 'zustand';
import { RoomingList } from '@/interfaces/rooming-list-res';

/**
 * Zustand store to manage the global state of all Rooming Lists
 * and the filtered version used in UI components.
 */
interface RoomingListState {
  allRoomingLists: RoomingList[];         // Complete list of all rooming lists
  filteredList: RoomingList[];            // List after filters (search/status/etc.)
  
  setFilteredList: (list: RoomingList[]) => void; // Update the filtered list
  clearFilteredList: () => void;                  // Reset the filtered list
  setAllRoomingLists: (list: RoomingList[]) => void; // Set all rooming lists
  sortByCutOffDate: (order: 'asc' | 'desc') => void; // Sort by cut-off date
}

interface Booking {
  guest_name: string;
  check_in_date: string;
  check_out_date: string;
}

/**
 * Interface for Rooming Lists with their associated bookings.
 */
interface RoomingWithBookings {
  rooming_list_id: number;
  rfp_name: string;
  bookings: Booking[];
}

/**
 * Zustand store to manage the state of Rooming Lists that include bookings.
 */
interface RoomingWithBookingsState {
  roomingListWithBookings: RoomingWithBookings[];               // List of Rooming Lists with bookings
  setRoomingListWithBookings: (data: RoomingWithBookings[]) => void; // Set the data
  clearRoomingListWithBookings: () => void;                          // Reset the data
}


// Store to manage basic rooming list state and filters
export const useRoomingListState = create<RoomingListState>((set, get) => ({
 allRoomingLists: [],
  filteredList: [],

  setFilteredList: (list) => set({ filteredList: list }),
  clearFilteredList: () => set({ filteredList: [] }),
  setAllRoomingLists: (list) => set({ allRoomingLists: list }),

  // Sorts either the filtered list or all rooming lists by cut-off date
  sortByCutOffDate: (order) => {
  const state = get();
  const source =
    state.filteredList.length > 0 ? state.filteredList : state.allRoomingLists;

  const sorted = [...source].sort((a, b) => {
    const dateA = new Date(a.cut_off_date).getTime();
    const dateB = new Date(b.cut_off_date).getTime();
    return order === 'asc' ? dateA - dateB : dateB - dateA;
  });

  if (state.filteredList.length > 0) {
    set({ filteredList: sorted });
  } else {
    set({ allRoomingLists: sorted });
  }
}

}));

// Store to manage rooming lists with bookings (used in detailed views)
export const useRoomingWithBookingsState = create<RoomingWithBookingsState>((set) => ({
  roomingListWithBookings: [],
  setRoomingListWithBookings: (data) => set({ roomingListWithBookings: data }),
  clearRoomingListWithBookings: () => set({ roomingListWithBookings: [] }),
}));
