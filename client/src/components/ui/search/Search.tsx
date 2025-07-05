'use client';
import React, { ChangeEvent, useState } from 'react';
import { IoSearchOutline } from 'react-icons/io5';

import { useRoomingListState, useUiStore } from '../../../store';
import { FilterDropdown } from '@/components';
import { getDataBySearch } from '@/actions';

export const Search = () => {
  // Zustand store function to toggle filters dropdown visibility
  const toggleFilter = useUiStore((state) => state.toggleFilter);
  // Zustand store state to check if filter dropdown is open
  const isFilterOpen = useUiStore((state) => state.isFilterOpen);
  // Local state to hold the search input value
  const [search, setSearch] = useState('');
  // Zustand store function to update filtered rooming list data
  const setFilteredList = useRoomingListState((state) => state.setFilteredList);
  // Zustand store action to sort rooming lists by cut-off date
  const sortByCutOffDate = useRoomingListState(
    (state) => state.sortByCutOffDate
  );
  // Local state to track sort order (ascending or descending)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  /**
   * Handle changes in the search input field.
   * Calls backend to get filtered rooming lists by search term,
   * updates Zustand store with results.
   * If input is empty, clears filtered list.
   */
  const handleInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim() === '') {
      // If there is no input, we clean the filters
      setFilteredList([]);
      return;
    }

    try {
      const data = await getDataBySearch(value);
      setFilteredList(data);
    } catch (error) {
      console.error('Error buscando:', error);
    }
  };
  /**
   * Handles the change of sorting order (asc/desc) from the dropdown.
   * Calls Zustand action to sort the list accordingly.
   */
  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as 'asc' | 'desc';
    setSortOrder(value);
    sortByCutOffDate(value);
  };
  /**
   * Clears search input and resets the filtered rooming list.
   */
  const handleClearAll = () => {
    setSearch('');
    useRoomingListState.getState().clearFilteredList();
  };

  return (
    <div className='w-full flex flex-col items-center sm:items-start relative'>
      <div className='flex flex-col sm:flex-row items-center gap-4 w-full max-w-2xl'>
        {/* Input */}
        <div className='relative w-full'>
          <IoSearchOutline
            size={20}
            className='absolute top-3 left-3 text-gray-400'
          />
          <input
            type='text'
            placeholder='Search by rfpName evnet_id'
            value={search}
            name='search'
            onChange={handleInputChange}
            className='
          w-full bg-gray-50 rounded pl-10 pr-10 py-2 text-base sm:text-lg
          border-2 border-gray-200 focus:outline-none focus:border-blue-500
        '
          />
        </div>

        {/* Dropdown orden */}
        <select
          value={sortOrder}
          onChange={handleSortChange}
          className='flex items-center gap-2 px-4 py-3 btnFilter font-semibold rounded transition w-full sm:w-[115px] justify-center'
        >
          <option value='asc'>Cut-Off ↑</option>
          <option value='desc'>Cut-Off ↓</option>
        </select>

        {/* Filters Button + Dropdown */}
        <div className='relative'>
          <button
            className='
          flex items-center gap-2 px-4 py-3 btnFilter font-semibold rounded transition w-full sm:w-[115px] justify-center
        '
            onClick={toggleFilter}
          >
            Filters
            <svg
              width='16'
              height='16'
              viewBox='0 0 18 18'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M11 5C12.1046 5 13 4.10457 13 3C13 1.89543 12.1046 1 11 1C9.89543 1 9 1.89543 9 3C9 4.10457 9.89543 5 11 5Z'
                stroke='#00C2A6'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M1 3H9'
                stroke='#00C2A6'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M13 3H17'
                stroke='#00C2A6'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M5 11C6.10457 11 7 10.1046 7 9C7 7.89543 6.10457 7 5 7C3.89543 7 3 7.89543 3 9C3 10.1046 3.89543 11 5 11Z'
                stroke='#00C2A6'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M1 9H3'
                stroke='#00C2A6'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M7 9H17'
                stroke='#00C2A6'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M14 17C15.1046 17 16 16.1046 16 15C16 13.8954 15.1046 13 14 13C12.8954 13 12 13.8954 12 15C12 16.1046 12.8954 17 14 17Z'
                stroke='#00C2A6'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M1 15H12'
                stroke='#00C2A6'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M16 15H17'
                stroke='#00C2A6'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </button>

          {isFilterOpen && <FilterDropdown />}
        </div>

        <button
          className='text-sm text-red-600 underline hover:text-red-800 transition'
          onClick={handleClearAll}
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};
