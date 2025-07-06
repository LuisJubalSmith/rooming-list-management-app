import { sendRequest } from "../api";

/**
 * Fetches all bookings associated with a specific rooming list ID.
 * Returns an array of bookings or an empty array if an error occurs.
 * @param id - Rooming List ID to fetch bookings for
 */
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
    console.error("Failed to fetch bookings:", error);
    return [];
  }
};
/**
 * Fetches all rooming lists along with their associated bookings count.
 * Each item in the returned array contains a `bookings` array.
 * Returns an array or empty array if an error occurs.
 */
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
    console.error("Failed to fetch rooming lists with bookings:", error);
    return [];
  }
};

/**
 * Creates a new booking linked to the specified rooming list ID.
 * Sends booking data in the request body.
 * Throws an error if the request fails.
 * @param rooming_list_id - The ID of the rooming list to associate the booking with
 * @param bookingData - Booking details to create
 */
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
      `${process.env.NEXT_PUBLIC_BACKEND_URL}api/bookings/${rooming_list_id}/create`,
      'POST',
      bookingData
    );
    return data;
  } catch (error) {
    console.error('Error al crear booking:', error);
    throw error;
  }
};
