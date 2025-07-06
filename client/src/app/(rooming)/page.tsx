'use client';
import { useState, useEffect } from 'react';
import { RoomingList } from '@/interfaces/rooming-list-res';

import {
  useRoomingFormStore,
  useRoomingListState,
  useRoomingWithBookingsState,
} from '../../store';
import { clearTabla, getAllRoomingList, insertAllData } from '@/actions';
import { RoomingForm, RoomingListGrid, Search, Title } from '@/components';
import { getRoomingListWithBookingsCount } from '@/actions';
import { toast } from 'react-toastify';

const Home = () => {
  const [dataFetchAll, setDataFetchAll] = useState<RoomingList[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [clearing, setClearing] = useState(false);
  const filteredList = useRoomingListState((state) => state.filteredList);
  const allRoomingLists = useRoomingListState((state) => state.allRoomingLists);
  const setAllRoomingLists = useRoomingListState(
    (state) => state.setAllRoomingLists
  );
  const isRoomingFormVisible = useRoomingFormStore((state) => state.isVisible);

  /**
   * Fetches all rooming list data and their associated booking counts.
   * Updates both local state and Zustand store for rooming lists and bookings.
   */
  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getAllRoomingList();
      setDataFetchAll(data);
      setAllRoomingLists(data);
      const bookingsData = await getRoomingListWithBookingsCount();
      useRoomingWithBookingsState
        .getState()
        .setRoomingListWithBookings(bookingsData);
    } catch (error) {
      console.error('Error fetching rooming list:', error);
      toast.error('Error al obtener datos');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Ensures the initial data is loaded when the component mounts.
   */
  useEffect(() => {
    fetchData();
  }, []);

  /**
   * Imports sample rooming and booking data into the backend.
   * Then refreshes the frontend state by re-fetching the data.
   */
  const handleImport = async () => {
    setImporting(true);
    try {
      await insertAllData();
      toast.success('Data imported successfully');
      await fetchData();
    } catch (error) {
      console.error('Error importing data:', error);
      toast.error('Error importing data');
    } finally {
      setImporting(false);
    }
  };

  /**
   * Clears all data from the backend tables.
   * Then refreshes the frontend state to reflect the empty state.
   */
  const handleClearTabla = async () => {
    const confirm = window.confirm('Are you sure you want to delete all data?');
    if (!confirm) return;

    setClearing(true);
    try {
      await clearTabla();
      toast.success('Data successfully deleted');
      await fetchData();
    } catch (error) {
      console.error('Error deleting data:', error);
      toast.error('Error deleting data');
    } finally {
      setClearing(false);
    }
  };

  /**
   * Callback triggered after successfully creating a new Rooming List.
   * It refetches all data to reflect the latest state in the UI.
   */
  const onCreated = () => {
    fetchData();
  };

  return (
    <main className='min-h-screen px-8 py-11 flex justify-start'>
      <div className='w-full max-w-full flex flex-col items-center sm:items-start'>
        <Title
          title='Rooming List Management App'
          subtitle='Events'
          className='text-center sm:text-left mb-8'
        />
        {isRoomingFormVisible && (
          <div className='w-full top-0'>
            <RoomingForm onCreated={onCreated} />
          </div>
        )}
        <Search />

        <div className='pt-4 space-y-6'>
          {loading ? (
            <p>Loading data...</p>
          ) : dataFetchAll.length === 0 ? (
            <div className='text-center'>
              <p className='mb-4 text-lg'>No data loaded.</p>
              <button
                className='
                  bg-blue-600 
                  text-white 
                  px-6 
                  py-3 
                  rounded-lg 
                  hover:bg-blue-700 
                  transition 
                  flex 
                  items-center 
                  justify-center 
                  gap-2'
                onClick={() => handleImport()}
                disabled={importing}
              >
                {importing && (
                  <svg
                    className='animate-spin h-5 w-5 text-white'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    ></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8v8z'
                    ></path>
                  </svg>
                )}
                {importing
                  ? 'Importando...'
                  : 'Insert Bookings and Rooming Lists'}
              </button>
            </div>
          ) : (
            <>
              <div className='flex'>
                <button
                  className='flex items-center gap-2 px-4 py-2 btnFilter font-semibold btn-color-red rounded transition w-full sm:w-[115px] justify-center'
                  onClick={() => handleClearTabla()}
                  disabled={clearing}
                >
                  {clearing && (
                    <svg
                      className='animate-spin h-5 w-5 text-white'
                      viewBox='0 0 24 24'
                    >
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      ></circle>
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8v8z'
                      ></path>
                    </svg>
                  )}
                  {clearing ? 'Erasing...' : 'Delete tables'}
                </button>
                <button
                  className='flex ml-4 items-center gap-2 px-4 py-2 btnFilter font-semibold btn-color-green rounded transition w-full sm:w-[115px] justify-center'
                  onClick={() => useRoomingFormStore.getState().toggleForm()}
                >
                  Create Rooming
                </button>
              </div>
              <RoomingListGrid
                roomingList={
                  filteredList.length > 0 ? filteredList : allRoomingLists
                }
                loading={loading}
              />
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;
