'use client';
import { createBooking } from '@/actions';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { toast } from 'react-toastify';

interface Props {
  roomingListId: number;
  onCreated: () => void;
}

export const BookingForm = ({ roomingListId, onCreated }: Props) => {
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
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
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
        <input
          type='date'
          name='check_in_date'
          value={check_in_date}
          onChange={handleInputChange}
          className='w-full border p-2 rounded'
        />
        <input
          type='date'
          name='check_out_date'
          value={check_out_date}
          onChange={handleInputChange}
          className='w-full border p-2 rounded'
        />
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
