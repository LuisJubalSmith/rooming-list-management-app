import { sendRequest } from "../api";

/**
 * Fetches all rooming lists from the backend API.
 * Returns an array of rooming lists or an empty array on error.
 */
export const getAllRoomingList = async () => {
  try {
    const data = await sendRequest("http://localhost:3001/api/rooming-lists", "GET");
    if (Array.isArray(data)) {
      return data;
    } else {
      console.error("Expected array but got:", data);
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch rooming lists:", error);
    return [];
  }
};

/**
 * Searches rooming lists by `rfp_name`, `event_id`, or `agreement_type`.
 * @param value - The search string used to filter results.
 * Returns an array of filtered rooming lists or an empty array on error.
 */
export const getDataBySearch = async (value: string) => {
  try {
    const data = await sendRequest(`http://localhost:3001/api/rooming-lists/search-bar?q=${value}`, "GET");
    if (Array.isArray(data)) {
      return data;
    } else {
      console.error("Expected array but got:", data);
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch rooming lists:", error);
    return [];
  }
};

/**
 * Filters rooming lists by `status` (e.g., active, closed, cancelled).
 * @param value - The status to filter by.
 * Returns an array of matching rooming lists or an empty array on error.
 */
export const getDataByStatus = async (value: string) =>{
  try {
    const data = await sendRequest(`http://localhost:3001/api/rooming-lists/status?status=${value}`, "GET");
    if (Array.isArray(data)) {
      return data;
    } else {
      console.error("Expected array but got:", data);
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch rooming lists:", error);
    return [];
  }
}

/**
 * Creates a new rooming list manually.
 * @param payload - Object containing all necessary rooming list fields.
 * Returns the newly created rooming list object or throws error on failure.
 */
export const createRoomingList = async (payload: {
  rooming_list_id: number;
  event_id: number;
  hotel_id: number;
  rfp_name: string;
  cut_off_date: string;
  status: string;
  agreement_type: string;
}) => {
  try {
    const data = await sendRequest(
      'http://localhost:3001/api/rooming-lists/create',
      'POST',
      payload
    );
    return data;
  } catch (error) {
    console.error('Failed to create Rooming List:', error);
    throw error;
  }
};


