import { sendRequest } from "../api";

export const insertAllData =async()=>{
    try {
        const response = await sendRequest("http://localhost:3001/api/import/data","POST")
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