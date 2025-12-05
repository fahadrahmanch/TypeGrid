import axios from "axios";
import store from "../../store/store";
import { setcompanyAccessToken,logout } from "../../store/slices/auth/companyAuthSlice";
import { companyRefreshAPI } from "../auth/authServices";
export const companyAPI = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/company",
  withCredentials: true,
});

companyAPI.interceptors.request.use((config: any) => {
  const token = store.getState().companyAuth.accessToken;
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
companyAPI.interceptors.response.use(
  (res) => res,
  async (error) => {
    const orginalRequest = error.config;
    if (!error.response) {
      return Promise.reject(error);
    }
    if (error.response?.status == 401 && !orginalRequest._retry) {
      orginalRequest._retry = true;
      try {
        const res = await companyRefreshAPI();
        const accessToken = await res.data.accessToken;
        store.dispatch(setcompanyAccessToken(accessToken));
        orginalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return companyAPI(orginalRequest);
      } catch (refreshError) {
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

