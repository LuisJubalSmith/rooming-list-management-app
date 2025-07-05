'use client';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { createRoomingList } from '@/actions/RoomingList/rooming-list-info';
import { useRoomingFormStore } from '@/store';
import { toast } from 'react-toastify';

interface Props {
  onCreated: () => void;
}

export const RoomingForm = ({ onCreated }: Props) => {
  // Toggles the visibility of the form
  const toggleForm = useRoomingFormStore((state) => state.toggleForm);
  // Generates a unique rooming list ID based on the current timestamp
  const generateRoomingListId = Date.now();
  // State for holding the form data
  const [form, setForm] = useState({
    rooming_list_id: generateRoomingListId,
    event_id: 1,
    hotel_id: 1,
    rfp_name: '',
    cut_off_date: '',
    status: 'received',
    agreement_type: 'leisure',
  });

  //Handles changes to input and select fields,
  //updating the form state accordingly.
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submits the form to create a new Rooming List.
  // If successful, notifies the user and resets the form state.
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await createRoomingList(form);
      toast.success('Rooming List created successfully');
      toggleForm();
      onCreated(); // refrescar
    } catch (error) {
      toast.error('Error creating Rooming List');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='absolute right-8 w-full max-w-lg bg-white border border-gray-200 rounded-xl p-6 shadow z-50'
    >
      <h2 className='text-lg font-semibold mb-4'>Crear Rooming List</h2>
      <div className='grid grid-cols-1 gap-4'>
        <input
          type='number'
          name='event_id'
          value={form.event_id}
          onChange={handleChange}
          placeholder='Event ID'
          className='border px-3 py-2 rounded'
          required
        />
        <input
          type='number'
          name='hotel_id'
          value={form.hotel_id}
          onChange={handleChange}
          placeholder='Hotel ID'
          className='border px-3 py-2 rounded'
          required
        />
        <input
          type='text'
          name='rfp_name'
          value={form.rfp_name}
          onChange={handleChange}
          placeholder='RFP Name'
          className='border px-3 py-2 rounded'
          required
        />
        <input
          type='date'
          name='cut_off_date'
          value={form.cut_off_date}
          onChange={handleChange}
          className='border px-3 py-2 rounded'
          required
        />
        <select
          name='status'
          value={form.status}
          onChange={handleChange}
          className='border px-3 py-2 rounded'
        >
          <option value='received'>Received</option>
          <option value='confirmed'>Confirmed</option>
          <option value='completed'>Completed</option>
          <option value='cancelled'>Cancelled</option>
          <option value='archived'>Archived</option>
        </select>
        <select
          name='agreement_type'
          value={form.agreement_type}
          onChange={handleChange}
          className='border px-3 py-2 rounded'
        >
          <option value='leisure'>Leisure</option>
          <option value='staff'>Staff</option>
          <option value='artist'>Artist</option>
        </select>
      </div>
      <div className='flex justify-end gap-4 mt-4'>
        <button
          type='button'
          onClick={() => toggleForm()}
          className='px-4 py-2 border border-gray-400 rounded hover:bg-gray-100'
        >
          Cancelar
        </button>
        <button
          type='submit'
          className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
        >
          Save
        </button>
      </div>
    </form>
  );
};
