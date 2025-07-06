import { sendRequest } from "../api";

/**
 * Performs a login request with hardcoded credentials (for development).
 * On success, stores the received JWT token in localStorage.
 */
export const login = async () => {
    console.log('login');
    
    try {

        // Send POST request to login endpoint with username and password
        const response = await sendRequest(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/auth/login`, "POST", {
            username: "admin",
            password: "123456"
         });
         console.log("Login response:", response);

        // If the response contains a token, save it in localStorage for auth
        if (response.token) {
            localStorage.setItem("token", response.token);
            console.log("Token stored in localStorage");
        }else{
            console.error("Login failed:", response);
        } 
        
    } catch (error) {
        console.error("Error when logging in to development:", error);
    }
};
