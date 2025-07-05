import { sendRequest } from "../api";

//Obtiene todos los rooming list
export const getAllRoomingList = async () => {
  try {
    const data = await sendRequest("http://localhost:3001/api/rooming-lists", "GET");
    if (Array.isArray(data)) {
      return data;
    } else {
      console.error("❌ Expected array but got:", data);
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch rooming lists:", error);
    return []; // ✅ Nunca retornes `false`, siempre un array
  }
};
//Obtiene la data por rfp_name, event_id y agreement_type
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
//Obtiene la data por status
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
// Crear Rooming List manualmente
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
    console.error('❌ Error al crear Rooming List:', error);
    throw error;
  }
};


