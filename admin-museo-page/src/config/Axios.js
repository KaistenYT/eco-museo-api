import axios  from "axios";
import { useAuth } from "../contexts/AuthContext";


const api = axios.create({
    baseURL : "http://localhost:3000/api"
})

api.interceptors.request.use((config)=>{
    const {token} = useAuth();
    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
})

api.interceptors.response.use((response)=>{
    return response;
}, (error)=>{
    if(error.response.status === 401){
        const {logout} = useAuth();
        logout();
    }
    return Promise.reject(error);
})