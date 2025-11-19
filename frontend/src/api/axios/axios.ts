import axios from "axios";
import store from "../../store/store";
import { setAccessToken, logout } from "../../store/slices/authSlice";
import { refreshAPI } from "../auth/authServices";
const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

API.interceptors.request.use((config: any) => {
    const token = store.getState().auth.accessToken;
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
API.interceptors.response.use(
    (res) => res,
    async (error) => {
        const orginalRequest = error.config;
        if (!error.response) {
            return Promise.reject(error);
        }
        // if (error.config?.url.includes("/refresh-token")) {
        //     console.log("logout immediatly")
        //     store.dispatch(logout());
        //     return Promise.reject(error);
        // }
        if (error.response?.status == 401 && !orginalRequest._retry) {
            orginalRequest._retry = true;
            try {
                const res = await refreshAPI();
                const accessToken = await res.data.accessToken;
                store.dispatch(setAccessToken(accessToken));
                orginalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
                return API(orginalRequest);
            }
            catch (refreshError) {
                store.dispatch(logout());
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);
export default API;