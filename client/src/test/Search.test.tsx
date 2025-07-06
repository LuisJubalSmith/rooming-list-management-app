import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Search } from '@/components/ui/search/Search';

import { getDataBySearch } from '@/actions';

// Mock de acciones
jest.mock('@/actions', () => ({
  getDataBySearch: jest.fn(),
}));

// Mock Zustand store
jest.mock('@/store', () => ({
  useUiStore: jest.fn(),
  useRoomingListState: jest.fn(() => ({
    setFilteredList: jest.fn(),
    sortByCutOffDate: jest.fn(),
  })),
}));

describe('Search component', () => {
  const setFilteredList = jest.fn();
  const sortByCutOffDate = jest.fn();
  const toggleFilter = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Estado inicial simulado de Zustand
    const useRoomingListState = require('@/store').useRoomingListState;
    const useUiStore = require('@/store').useUiStore;

    useRoomingListState.mockImplementation((fn: any) =>
      fn({ setFilteredList, sortByCutOffDate })
    );
    useUiStore.mockImplementation((fn: any) =>
      fn({ toggleFilter, isFilterOpen: false })
    );
  });

  test('renderiza el input y botones', () => {
    render(<Search />);
    expect(
      screen.getByPlaceholderText(/Search by rfpName/i)
    ).toBeInTheDocument();

    // Ahora usamos query más robusto
    const filterBtn = screen.getByRole('button', { name: /^Filters$/i });

    expect(filterBtn).toBeInTheDocument();

    expect(screen.getByText(/Clear Filters/i)).toBeInTheDocument();
  });

  test('realiza búsqueda y actualiza Zustand al escribir', async () => {
    const mockResults = [{ id: 1, rfp_name: 'Test' }];
    (getDataBySearch as jest.Mock).mockResolvedValue(mockResults);

    render(<Search />);
    const input = screen.getByPlaceholderText(/Search by rfpName/i);

    fireEvent.change(input, { target: { value: 'Test' } });

    await waitFor(() => {
      expect(getDataBySearch).toHaveBeenCalledWith('Test');
      expect(setFilteredList).toHaveBeenCalledWith(mockResults);
    });
  });

  test('limpia búsqueda si el input queda vacío', async () => {
    render(<Search />);
    const input = screen.getByPlaceholderText(/Search by rfpName/i);

    fireEvent.change(input, { target: { value: '   ' } });

    await waitFor(() => {
      expect(setFilteredList).toHaveBeenCalledWith([]);
    });
  });

  test('cambia ordenamiento cuando se selecciona otra opción', () => {
    render(<Search />);
    const select = screen.getByRole('combobox');

    fireEvent.change(select, { target: { value: 'desc' } });

    expect(sortByCutOffDate).toHaveBeenCalledWith('desc');
  });

  test('botón "Filters" llama a toggleFilter', () => {
    render(<Search />);

    const btn = screen
      .getAllByText(/Filters/i)
      .find((el) => el.textContent === 'Filters');

    expect(btn).toBeInTheDocument();
    fireEvent.click(btn!);
    expect(toggleFilter).toHaveBeenCalled();
  });
});
