import axios from "axios";
import store from "../../store/store";
import {setuserAccessToken,logout} from "../../store/slices/auth/userAuthSlice";
import { userRefreshAPI } from "../auth/authServices";
export const userAPI = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/user",
  withCredentials: true,
});

userAPI.interceptors.request.use((config: any) => {
  const token = store.getState().userAuth.accessToken;
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
userAPI.interceptors.response.use(
  (res) => res,
  async (error) => {
    const orginalRequest = error.config;
    if (!error.response) {
      return Promise.reject(error);
    }
    if (error.response?.status == 401 && !orginalRequest._retry) {
      orginalRequest._retry = true;
      try {
        const res = await userRefreshAPI();
        const accessToken = await res.data.accessToken;
        const user = res.data.user ;
        
        store.dispatch(setuserAccessToken({ accessToken, user }));
        orginalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return userAPI(orginalRequest);
      } catch (refreshError) {
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);
