'use client';
import { useState } from 'react';
import {
  getBookingsByRoomingListId,
  getRoomingListWithBookingsCount,
} from '@/actions';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { RoomingList } from '@/interfaces/rooming-list-res';
import { useRoomingWithBookingsState } from '@/store';
import { BookingForm } from '@/components';
import { log } from 'node:console';

interface Props {
  item: RoomingList;
}

export const RoomingListCard = ({ item }: Props) => {
  // State to track which RoomingList ID's booking form is currently active (open)
  const [activeFormId, setActiveFormId] = useState<number | null>(null);

  // Fetches updated rooming lists with their booking counts from backend,
  // updates the Zustand store and hides the booking form.
  const fetchRoomingListWithBookings = async () => {
    const data = await getRoomingListWithBookingsCount();
    useRoomingWithBookingsState.getState().setRoomingListWithBookings(data);
    setActiveFormId(null);
  };
  // Get booking counts for all rooming lists from Zustand store
  const bookingsData = useRoomingWithBookingsState(
    (state) => state.roomingListWithBookings
  );
  // Find booking count for this specific rooming list, defaulting to 0
  const bookingCount =
    bookingsData.find((rb) => rb.rooming_list_id === item.rooming_list_id)
      ?.bookings.length || 0;

  // Fetches bookings for this specific rooming list and logs them to console.
  // This is triggered by the 'View Bookings' button.
  const handleViewBookings = async () => {
    const bookings = await getBookingsByRoomingListId(item.rooming_list_id);
    console.log(
      `Bookings for Rooming List ID ${item.rooming_list_id}:`,
      bookings
    );
  };

  // Parse cut off date to display month and day in UI
  const cutOffDate = new Date(item.cut_off_date);
  const month = cutOffDate
    .toLocaleString('en-US', { month: 'short' })
    .toUpperCase();
  const day = cutOffDate.getDate();

  // Current date and cut off date as localized strings for display
  const today = new Date().toLocaleDateString();
  const checkOut = new Date(item.cut_off_date).toLocaleDateString();

  // Determine if booking form for this card is currently visible
  const isFormVisible = activeFormId === item.rooming_list_id;

  return (
    <>
      <div
        className='
        relative min-w-[350px] 
        sm:min-w-[350px] 
        max-w-full 
        sm:max-w-[280px] 
        h-auto 
        bg-white 
        border 
        border-gray-200 
        rounded-2xl 
        shadow-sm 
        p-4 
        flex 
        flex-col 
        justify-between space-y-3'
      >
        <h3 className='text-sm font-semibold text-black'>{item.rfp_name}</h3>

        <p className='text-sm text-gray-700'>
          Agreement:{' '}
          <span className='font-semibold'>{item.agreement_type}</span>
        </p>

        {/* Cut-off date displayed top-right with month and day */}
        <div className='absolute flex justify-end right-4 top-0'>
          <div className='text-center'>
            <div className='bg-blue-100 text-blue-600 text-xs font-bold rounded-t px-2 py-1'>
              {month}
            </div>
            <div className='bg-gray-100 text-xl font-bold leading-tight text-gray-800'>
              {day}
            </div>
            <p className='bg-gray-100 text-[10px] text-gray-400 mb-4'>
              Cut-Off Date
            </p>
          </div>
        </div>

        {/* Display today's date and the cut-off date with calendar icons */}
        <div className='flex items-center text-sm text-gray-500 gap-2'>
          <FaRegCalendarAlt className='text-gray-400' />
          <span>{today}</span>
          <FaRegCalendarAlt className='text-gray-400' />
          <span>{checkOut}</span>
        </div>

        <div className='flex mt-2 space-y-2 justify-between'>
          <button
            onClick={() => handleViewBookings()}
            className='
              bg-[#4D2CFF] 
              hover:bg-[#3c21d6] 
              text-white 
              text-sm 
              font-semibold 
              w-[268px]
              rounded-lg
              p-0
              h-10
              mt-2 
              flex 
              items-center 
              justify-center 
              gap-2 
              transition'
          >
            View Bookings <span className='ml-1'>({bookingCount})</span>
          </button>
          <button
            onClick={() => alert('PDF Load')}
            className='flex-shrink-0 w-[40px] p-1 justify-center align-middle gap-10 border-2 rounded-md border-[#4D2CFF]'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='30'
              height='30'
              viewBox='0 0 24 24'
              fill='none'
            >
              <path
                d='M19.0652 5.76422L14.5741 1.27318C14.3981 1.09817 14.16 0.999926 13.9117 0.999969H4.92967C2.76022 1.00204 1.00207 2.76019 1 4.92964V19.1512C1.00207 21.3206 2.76022 23.0788 4.92967 23.0809H12.134C12.2795 23.0817 12.423 23.0484 12.5532 22.9836C12.9409 22.7891 13.1451 22.3545 13.0472 21.9319C13.0182 21.8138 12.9674 21.7021 12.8975 21.6026C10.9339 18.5648 11.8047 14.5104 14.8425 12.5468C15.9033 11.8611 17.1397 11.4968 18.4028 11.4978C18.9195 11.4978 19.3384 11.0789 19.3384 10.5621V6.42661C19.3384 6.17841 19.2402 5.94022 19.0652 5.76422ZM9.04642 18.3391H5.30388C4.78713 18.3391 4.36824 17.9202 4.36824 17.4034C4.36824 16.8867 4.78713 16.4678 5.30388 16.4678H9.04642C9.56316 16.4678 9.98205 16.8867 9.98205 17.4034C9.98205 17.9202 9.56316 18.3391 9.04642 18.3391ZM10.5884 13.601H5.30392C4.78718 13.601 4.36829 13.1822 4.36829 12.6654C4.36829 12.1487 4.78718 11.7298 5.30392 11.7298H10.5884C11.1051 11.7298 11.524 12.1487 11.524 12.6654C11.524 13.1822 11.1051 13.601 10.5884 13.601ZM17.4671 6.98799H13.3503V2.87124H13.5225L17.4671 6.81587V6.98799Z'
                fill='#4323FF'
              />
              <path
                d='M22.6242 16.5688C21.8532 15.6669 20.2738 14.1549 18.3202 14.1549C16.3666 14.1549 14.7835 15.6519 14.0163 16.5688C13.5154 17.1522 13.5154 18.0139 14.0163 18.5973C14.7648 19.4992 16.3666 21.0112 18.3202 21.0112C20.2738 21.0112 21.8532 19.5142 22.6242 18.5973C23.1251 18.0139 23.1251 17.1522 22.6242 16.5688ZM18.3202 18.893C17.5968 18.893 17.0103 18.3065 17.0103 17.5831C17.0103 16.8596 17.5968 16.2732 18.3202 16.2732C19.0437 16.2732 19.6301 16.8596 19.6301 17.5831C19.6301 18.3065 19.0437 18.893 18.3202 18.893Z'
                fill='#4323FF'
              />
            </svg>
          </button>
        </div>
        <button
          onClick={() =>
            setActiveFormId(isFormVisible ? null : item.rooming_list_id)
          }
          className='hover:text-green-700 text-green-600 text-sm underline transition'
        >
          {isFormVisible ? 'Close' : 'Add Booking'}
        </button>

        {/* Modal-like BookingForm */}
      </div>
      {/* Conditional rendering of the BookingForm modal */}
      {isFormVisible && (
        <div className='absolute top-8 right-4 w-[400px] bg-white bg-opacity-95 backdrop-blur-md rounded-2xl z-50 p-4 shadow-lg'>
          <BookingForm
            roomingListId={item.rooming_list_id}
            onCreated={fetchRoomingListWithBookings}
          />
          <button
            onClick={() => setActiveFormId(null)}
            className='mt-4 text-sm text-gray-600 underline'
          >
            Cancelar
          </button>
        </div>
      )}
    </>
  );
};
