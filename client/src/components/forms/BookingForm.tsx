'use client';
import { createBooking } from '@/actions';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { toast } from 'react-toastify';

interface Props {
  roomingListId: number;
  onCreated: () => void;
}

export const BookingForm = ({ roomingListId, onCreated }: Props) => {
  // Local state to manage the form inputs
  const [form, setForm] = useState({
    hotel_id: 1,
    event_id: 1,
    guest_name: '',
    guest_phone_number: '',
    check_in_date: '',
    check_out_date: '',
  });
  const { guest_name, guest_phone_number, check_in_date, check_out_date } =
    form;

  // Handles form input changes and updates the corresponding state.
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  //Submits the form to create a new booking for the specified rooming list.
  //Displays a success or error toast notification and calls onCreated callback.
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await createBooking(roomingListId, form);
      toast.success('Booking created successfully');
      onCreated();
    } catch (error) {
      toast.error('Error creating booking');
    }
  };
  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className='space-y-4 p-4 border rounded-lg bg-white'
      >
        <h3 className='text-lg font-bold'>Add Booking</h3>
        <input
          type='text'
          name='guest_name'
          value={guest_name}
          onChange={handleInputChange}
          placeholder='Guest Name'
          className='w-full border p-2 rounded'
        />
        <input
          type='text'
          name='guest_phone_number'
          value={guest_phone_number}
          onChange={handleInputChange}
          placeholder='Phone number'
          className='w-full border p-2 rounded'
        />
        <div>
          <span>Check in</span>
          <input
            type='date'
            name='check_in_date'
            value={check_in_date}
            onChange={handleInputChange}
            className='w-full border p-2 rounded'
          />
        </div>
        <div>
          <span>Check out</span>
          <input
            type='date'
            name='check_out_date'
            value={check_out_date}
            onChange={handleInputChange}
            className='w-full border p-2 rounded'
          />
        </div>
        <button
          type='submit'
          className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
        >
          Save
        </button>
      </form>
    </div>
  );
};
