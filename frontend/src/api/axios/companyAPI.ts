import axios from "axios";
import store from "../../store/store";

export const companyAPI = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/company",
  withCredentials: true,
});

// companyAPI.interceptors.request.use((config: any) => {
//     const token = store.getState().userAuth.accessToken;
//     if (token) {
//         config.headers = config.headers || {};
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });
