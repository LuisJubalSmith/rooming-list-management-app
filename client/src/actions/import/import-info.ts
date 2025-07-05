import { sendRequest } from "../api";

/**
 * Calls the backend API to insert all initial import data.
 * Returns the response object on success or failure.
 * Returns false if there is an error during the request.
 */
export const insertAllData =async()=>{
    try {
        const response = await sendRequest("http://localhost:3001/api/import/data","POST")
        // Assuming the backend sends { ok: true } or similar in response
        if (response.ok) {
            return await response
        } else {
            return await response
        }
    } catch (error) {
         console.error('Error during called:', error);
        return false;
    }
}

/**
 * Calls the backend API to clear all data in the import-related tables.
 * Returns the response object on success or failure.
 * Returns false if there is an error during the request.
 */
export const clearTabla =async()=>{
    try {
       const response = await sendRequest("http://localhost:3001/api/import/clear","DELETE")
       if (response.ok) {
            return await response
        } else {
            return await response
        } 
    } catch (error) {
        console.error('Error during called:', error);
        return false;
    }
}