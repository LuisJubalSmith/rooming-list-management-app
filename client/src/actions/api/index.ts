import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export const sendRequest = async (
  url: string,
  method: string,
  formData?: any
): Promise<any> => {
  try {
    const token = localStorage.getItem("token"); // ✅ Agrega token si existe

    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'x-auth-token': token }) // 👈 Clave correcta del header
      },
    };

    let response: AxiosResponse;

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

    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error(`Error in sending request: ${error.response.status} - ${error.response.statusText}`);
    } else {
      console.error('Error in sending request:', error.message);
    }
    throw error;
  }
};
