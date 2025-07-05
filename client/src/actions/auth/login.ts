import { sendRequest } from "../api";

export const login = async () => {
    console.log('login');
    
    try {

        const response = await sendRequest("http://localhost:3001/api/auth/login", "POST", {
            username: "admin",
            password: "123456"
         });
         console.log("Response del login:", response);

    // ✅ Guarda el token al hacer login
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
