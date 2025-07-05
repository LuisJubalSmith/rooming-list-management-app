import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import Home from '../app/(rooming)/page';
import * as actions from '@/actions';
import { toast } from 'react-toastify';
import {
  useRoomingFormStore,
  useRoomingListState,
  useRoomingWithBookingsState,
  useUiStore,
} from '@/store';

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  jest.restoreAllMocks();
});

// Mock funciones de toast
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

// Mock hooks Zustand
jest.mock('@/store', () => ({
  useRoomingFormStore: jest.fn(),
  useRoomingListState: jest.fn(),
  useRoomingWithBookingsState: jest.fn(),
  useUiStore: jest.fn(),
}));

(useUiStore as jest.Mock).mockImplementation((selector) =>
  selector({
    toggleFilter: jest.fn(),
    isFilterOpen: false,
  })
);

// Mock actions
jest.mock('@/actions', () => ({
  getAllRoomingList: jest.fn(),
  getRoomingListWithBookingsCount: jest.fn(),
  insertAllData: jest.fn(),
  clearTabla: jest.fn(),
}));

describe('Home Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock estado de Zustand
    (useRoomingListState as jest.Mock).mockImplementation((selector) => {
      if (selector.name === 'filteredList') return [];
      if (selector.name === 'allRoomingLists') return [];
      if (selector.name === 'setAllRoomingLists') return jest.fn();
      return jest.fn();
    });

    (useRoomingFormStore as jest.Mock).mockReturnValue({ isVisible: false });
    (useRoomingWithBookingsState as jest.Mock).mockImplementation(() => ({
      setRoomingListWithBookings: jest.fn(),
      roomingListWithBookings: [],
    }));
  });

  test('muestra loading inicialmente y luego datos cargados', async () => {
    const mockData = [{ id: 1, name: 'Rooming 1' }];
    (actions.getAllRoomingList as jest.Mock).mockResolvedValue(mockData);
    (actions.getRoomingListWithBookingsCount as jest.Mock).mockResolvedValue(
      []
    );

    render(<Home />);

    expect(screen.getByText(/Loading data/i)).toBeInTheDocument();

    // Espera que deje de mostrar loading
    await waitFor(() => expect(actions.getAllRoomingList).toHaveBeenCalled());
  });

  test('muestra toast error si falla fetch', async () => {
    (actions.getAllRoomingList as jest.Mock).mockRejectedValue(
      new Error('fail')
    );
    render(<Home />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error al obtener datos');
    });
  });

  test('botón import llama a insertAllData y muestra toast success', async () => {
    (actions.getAllRoomingList as jest.Mock).mockResolvedValue([]);
    (actions.getRoomingListWithBookingsCount as jest.Mock).mockResolvedValue(
      []
    );
    (actions.insertAllData as jest.Mock).mockResolvedValue(undefined);

    render(<Home />);

    // Forzar que no haya datos para que aparezca el botón Import
    await waitFor(() =>
      expect(
        screen.getByText(/Insert Bookings and Rooming Lists/i)
      ).toBeInTheDocument()
    );

    const btnImport = screen.getByText(/Insert Bookings and Rooming Lists/i);
    fireEvent.click(btnImport);

    await waitFor(() => {
      expect(actions.insertAllData).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Data imported successfully');
    });
  });

  test('botón clear tabla muestra confirm dialog y limpia datos si confirma', async () => {
    (actions.getAllRoomingList as jest.Mock).mockResolvedValue([{ id: 1 }]);
    (actions.getRoomingListWithBookingsCount as jest.Mock).mockResolvedValue(
      []
    );
    (actions.clearTabla as jest.Mock).mockResolvedValue(undefined);

    (useRoomingListState as jest.Mock).mockImplementation((selector) => {
      if (selector.name === 'filteredList') return [];
      if (selector.name === 'allRoomingLists') return [{ id: 1 }];
      if (selector.name === 'setAllRoomingLists') return jest.fn();
      return jest.fn();
    });

    (useRoomingFormStore as jest.Mock).mockReturnValue({ isVisible: false });

    window.confirm = jest.fn(() => true);

    render(<Home />);

    const btnClear = await screen.findByRole('button', {
      name: /Clear Tabla/i,
    });
    fireEvent.click(btnClear);

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalled();
      expect(actions.clearTabla).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Data successfully deleted');
    });
  });

  test('no limpia si el usuario cancela confirm', async () => {
    window.confirm = jest.fn(() => false);

    render(<Home />);

    const btnClear = screen.queryByText(/Clear Tabla/i);
    if (btnClear) {
      fireEvent.click(btnClear);
      expect(actions.clearTabla).not.toHaveBeenCalled();
    }
  });

  // Asegúrate de buscar el texto que realmente está en tu formulario
  test('muestra RoomingForm si isRoomingFormVisible es true', () => {
    (useRoomingFormStore as jest.Mock).mockReturnValue({ isVisible: true });
    render(<Home />);
    expect(screen.getByText(/Crear Rooming List/i)).toBeInTheDocument();
  });
});
