import { sendRequest } from "../api";

/**
 * Performs a login request with hardcoded credentials (for development).
 * On success, stores the received JWT token in localStorage.
 */
export const login = async () => {
    console.log('login');
    
    try {

        // Send POST request to login endpoint with username and password
        const response = await sendRequest("http://localhost:3001/api/auth/login", "POST", {
            username: "admin",
            password: "123456"
         });
         console.log("Response del login:", response);

        // If the response contains a token, save it in localStorage for auth
        if (response.token) {
            localStorage.setItem("token", response.token);
            console.log("Token almacenado en localStorage");
        }else{
            console.error("Falló el login:", response);
        } 
        
    } catch (error) {
        console.error("Error al hacer login de desarrollo:", error);
    }
};
