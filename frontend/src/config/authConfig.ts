// src/config/authConfig.ts
import { userRefreshAPI, adminRefreshAPI, companyRefreshAPI } from "../api/auth/authServices";
import { setAccessToken, setAuthLoaded, logout } from "../store/slices/auth/authSlice";

export const authConfig: Record<
  string,
  {
    refreshFn: () => Promise<any>;
    setToken: (data: any) => any;
    setLoaded: (val: boolean) => any;
    logout: () => any;
  }
> = {
  admin: {
    refreshFn: adminRefreshAPI,
    setToken: setAccessToken,
    setLoaded: setAuthLoaded,
    logout: logout,
  },
  company: {
    refreshFn: companyRefreshAPI,
    setToken: setAccessToken,
    setLoaded: setAuthLoaded,
    logout: logout,
  },
  user: {
    refreshFn: userRefreshAPI,
    setToken: setAccessToken,
    setLoaded: setAuthLoaded,
    logout: logout,
  },
};
