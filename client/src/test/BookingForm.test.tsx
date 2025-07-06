import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BookingForm } from '@/components';
import { toast } from 'react-toastify';
import { createBooking } from '@/actions';

// Mocks
jest.mock('@/actions', () => ({
  createBooking: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('BookingForm Component', () => {
  const mockOnCreated = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza correctamente los campos del formulario', () => {
    render(<BookingForm roomingListId={1} onCreated={mockOnCreated} />);

    expect(screen.getByPlaceholderText('Guest Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Phone number')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });

  test('actualiza el estado local al escribir en inputs', () => {
    render(<BookingForm roomingListId={1} onCreated={mockOnCreated} />);

    const guestInput = screen.getByPlaceholderText('Guest Name');
    fireEvent.change(guestInput, { target: { value: 'John Doe' } });

    expect((guestInput as HTMLInputElement).value).toBe('John Doe');
  });

  test('envía el formulario exitosamente', async () => {
    (createBooking as jest.Mock).mockResolvedValue(undefined);

    const { container } = render(
      <BookingForm roomingListId={1} onCreated={mockOnCreated} />
    );

    const checkInInput = container.querySelector(
      'input[name="check_in_date"]'
    )!;
    const checkOutInput = container.querySelector(
      'input[name="check_out_date"]'
    )!;

    fireEvent.change(screen.getByPlaceholderText('Guest Name'), {
      target: { value: 'Jane Smith' },
    });
    fireEvent.change(screen.getByPlaceholderText('Phone number'), {
      target: { value: '1234567890' },
    });
    fireEvent.change(checkInInput, {
      target: { value: '2025-07-10' },
    });
    fireEvent.change(checkOutInput, {
      target: { value: '2025-07-12' }, // antes decía 2025-07-15
    });

    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(createBooking).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          guest_name: 'Jane Smith',
          guest_phone_number: '1234567890',
          check_in_date: expect.any(String),
          check_out_date: expect.any(String),
        })
      );
      expect(toast.success).toHaveBeenCalledWith(
        'Booking created successfully'
      );
      expect(mockOnCreated).toHaveBeenCalled();
    });
  });

  test('muestra toast de error si falla el createBooking', async () => {
    (createBooking as jest.Mock).mockRejectedValue(new Error('fail'));

    render(<BookingForm roomingListId={1} onCreated={mockOnCreated} />);

    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error creating booking');
      expect(mockOnCreated).not.toHaveBeenCalled();
    });
  });
});
