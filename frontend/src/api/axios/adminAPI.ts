import axios from "axios";
import store from "../../store/store";
import { setAdminAccessToken,logout } from "../../store/slices/auth/adminAuthSlice";
import { adminRefreshAPI } from "../auth/authServices";
export const adminAPI = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/admin",
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
adminAPI.interceptors.response.use(
  (res) => res,
  async (error) => {
    const orginalRequest = error.config;
    if (!error.response) {
      return Promise.reject(error);
    }
    if (error.response?.status == 401 && !orginalRequest._retry) {
      orginalRequest._retry = true;
      try {
        const res = await adminRefreshAPI();
        const accessToken = await res.data.accessToken;
        store.dispatch(setAdminAccessToken(accessToken));
        orginalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return adminAPI(orginalRequest);
      } catch (refreshError) {
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);
