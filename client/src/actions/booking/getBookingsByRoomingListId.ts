import { sendRequest } from "../api";

export const getBookingsByRoomingListId = async (id: number) => {
  try {
    const data = await sendRequest(
      `http://localhost:3001/api/bookings/${id}/bookings-by-id`,
      "GET"
    );

    if (Array.isArray(data)) {
      return data;
    } else {
      console.error("Expected array but got:", data);
      return [];
    }
  } catch (error) {
    console.error("❌ Failed to fetch bookings:", error);
    return [];
  }
};

export const getRoomingListWithBookingsCount = async () => {
  try {
    const data = await sendRequest(
      'http://localhost:3001/api/bookings/bookings-for-rooming',
      'GET'
    );

    if (Array.isArray(data)) {
      return data; // cada item contiene `bookings: []`
    } else {
      console.error("Expected array but got:", data);
      return [];
    }
  } catch (error) {
    console.error("❌ Failed to fetch rooming lists with bookings:", error);
    return [];
  }
};

export const createBooking = async (
  rooming_list_id: number,
  bookingData: {
    hotel_id: number;
    event_id: number;
    guest_name: string;
    guest_phone_number: string;
    check_in_date: string;
    check_out_date: string;
  }
) => {
  try {
    const data = await sendRequest(
      `http://localhost:3001/api/bookings/${rooming_list_id}/create`,
      'POST',
      bookingData
    );
    return data;
  } catch (error) {
    console.error('❌ Error al crear booking:', error);
    throw error;
  }
};
