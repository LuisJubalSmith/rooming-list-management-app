import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { RoomingForm } from '@/components/forms/RoomingForm';
import { createRoomingList } from '@/actions/RoomingList/rooming-list-info';
import { toast } from 'react-toastify';

// Mock actions y Zustand
jest.mock('@/actions/RoomingList/rooming-list-info', () => ({
  createRoomingList: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('@/store', () => ({
  useRoomingFormStore: jest.fn().mockImplementation((sel) =>
    sel({
      toggleForm: jest.fn(),
    })
  ),
}));

describe('RoomingForm Component', () => {
  const mockOnCreated = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza campos correctamente', () => {
    render(<RoomingForm onCreated={mockOnCreated} />);
    expect(screen.getByPlaceholderText('Event ID')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Hotel ID')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('RFP Name')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
  });

  test('envía correctamente el formulario', async () => {
    (createRoomingList as jest.Mock).mockResolvedValue(undefined);

    render(<RoomingForm onCreated={mockOnCreated} />);

    fireEvent.change(screen.getByPlaceholderText('RFP Name'), {
      target: { value: 'Ultra Music Fest' },
    });
    fireEvent.change(screen.getByPlaceholderText('Event ID'), {
      target: { value: '2' },
    });
    fireEvent.change(screen.getByPlaceholderText('Hotel ID'), {
      target: { value: '5' },
    });
    fireEvent.change(screen.getByDisplayValue(''), {
      target: { name: 'cut_off_date', value: '2025-08-15' },
    });

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(createRoomingList).toHaveBeenCalledWith(
        expect.objectContaining({
          rfp_name: 'Ultra Music Fest',
          event_id: '2', // Importante: los valores vienen como strings
          hotel_id: '5',
          cut_off_date: '2025-08-15',
          status: 'received',
          agreement_type: 'leisure',
        })
      );
    });
  });

  test('muestra error si falla la creación', async () => {
    (createRoomingList as jest.Mock).mockRejectedValue(new Error('fail'));

    render(<RoomingForm onCreated={mockOnCreated} />);

    fireEvent.change(screen.getByPlaceholderText('RFP Name'), {
      target: { value: 'Test Fail' },
    });
    fireEvent.change(screen.getByPlaceholderText('Event ID'), {
      target: { value: '1' },
    });
    fireEvent.change(screen.getByPlaceholderText('Hotel ID'), {
      target: { value: '1' },
    });
    fireEvent.change(screen.getByDisplayValue(''), {
      target: { name: 'cut_off_date', value: '2025-07-15' },
    });

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error creating Rooming List');
    });
  });
});
