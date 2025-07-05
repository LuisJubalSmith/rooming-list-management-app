'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUiStore, useRoomingListState } from '../../../store';
import { getDataByStatus } from '@/actions';

export const FilterDropdown = () => {
  // Closes the filter panel using the global Zustand UI state
  const closeFilter = useUiStore((state) => state.closeFilter);
  // Sets the filtered rooming list in the Zustand global state
  const setFilteredList = useRoomingListState((state) => state.setFilteredList);
  // Clears any active filters from Zustand state
  const clearFilteredList = useRoomingListState(
    (state) => state.clearFilteredList
  );

  // Local state to track the selected filter status
  const [selectedStatus, setSelectedStatus] = useState<string>('closed');

  // Clear existing filters when the component mounts
  useEffect(() => {
    clearFilteredList();
  }, [clearFilteredList]);

  // Handle ratio input changes by updating the selected status.
  const handleCheckboxChange = (value: string) => {
    setSelectedStatus(value);
  };

  // Fetches filtered rooming list data based on the selected status.
  // Updates Zustand store with the filtered list and closes the filter panel.
  const handleSave = async () => {
    try {
      const data = await getDataByStatus(selectedStatus);
      setFilteredList(data);
    } catch (error) {
      console.error('Error filtering by status:', error);
    }
    closeFilter();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className='absolute right-0 mt-2 bg-white p-4 w-64 rounded shadow-lg z-50'
    >
      <h4 className='text-sm font-semibold text-gray-500 mb-2'>RFP STATUS</h4>
      <div className='flex flex-col gap-2'>
        {['active', 'closed', 'cancelled'].map((status) => (
          <label
            key={status}
            className='flex items-center gap-2 text-gray-800 capitalize'
          >
            <input
              type='radio'
              name='status'
              value={status}
              checked={selectedStatus === status}
              onChange={() => handleCheckboxChange(status)}
              className='accent-[#4D2CFF] w-4 h-4'
            />
            {status}
          </label>
        ))}
      </div>

      {/* Button to confirm and apply the selected filter */}
      <button
        onClick={handleSave}
        className='mt-4 w-full bg-[#552bff] text-white py-2 rounded-md font-semibold hover:bg-[#4620e0] transition'
      >
        Save
      </button>
    </motion.div>
  );
};
