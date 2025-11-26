import axios from "axios";
import store from "../../store/store";
import { setAccessToken, logout } from "../../store/slices/auth/adminAuthSlice"
// import { refreshAPI } from "../auth/authServices";

export const adminAPI = axios.create({
    baseURL: import.meta.env.VITE_API_URL+'/admin',
    withCredentials: true,
});

adminAPI.interceptors.request.use((config: any) => {
    const token = store.getState().adminAuth.accessToken;
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});