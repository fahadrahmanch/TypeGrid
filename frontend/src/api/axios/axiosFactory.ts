import axios from "axios";
import store from "../../store/store";

export function createAPI(
  path: string,
  getToken: () => string | null,
  refreshAPI: () => Promise<any>,
  setToken: (data: any) => any,
  logoutAction: () => any
) {
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL + path,
    withCredentials: true,
  });

  api.interceptors.request.use((config: any) => {
    const token = getToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  api.interceptors.response.use(
    (res) => res,
    async (error) => {
      const originalRequest = error.config;
      if (!error.response) return Promise.reject(error);
      if (originalRequest.url?.includes("refresh-token")) {
        store.dispatch(logoutAction());
        return Promise.reject(error);
      }

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const res = await refreshAPI();
          const accessToken = res.data.accessToken;
          const user = res.data.user;
          store.dispatch(setToken({ accessToken, user }));
          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          store.dispatch(logoutAction());
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );

  return api;
}