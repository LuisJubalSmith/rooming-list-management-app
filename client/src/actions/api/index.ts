import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * Generic function to send HTTP requests using axios with JSON content type
 * and optional JWT token authentication.
 * 
 * @param url - The endpoint URL
 * @param method - HTTP method: GET, POST, PUT, DELETE
 * @param formData - Optional request body for POST and PUT
 * @returns Promise resolving to response data
 * @throws Throws an error if request fails
 */

export const sendRequest = async (
  url: string,
  method: string,
  formData?: any
): Promise<any> => {
  try {
    // Retrieve JWT token from localStorage if present
    const token = localStorage.getItem("token"); // ✅ Agrega token si existe

    // Axios config with headers, including token if available
    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'x-auth-token': token }) // 👈 Clave correcta del header
      },
    };

    let response: AxiosResponse;

    // Send the request based on method type
    switch (method.toLowerCase()) {
      case 'get':
        response = await axios.get(url, config);
        break;
      case 'post':
        response = await axios.post(url, formData, config);
        break;
      case 'put':
        response = await axios.put(url, formData, config);
        break;
      case 'delete':
        response = await axios.delete(url, config);
        break;
      default:
        throw new Error('Unsupported HTTP method');
    }
    // Return only the response data
    return response.data;
  } catch (error: any) {
    // Log errors with detailed info if response exists, else log generic message
    if (error.response) {
      console.error(`Error in sending request: ${error.response.status} - ${error.response.statusText}`);
    } else {
      console.error('Error in sending request:', error.message);
    }
    throw error;
  }
};
