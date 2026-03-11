// src/config/authConfig.ts

import { userRefreshAPI, adminRefreshAPI, companyRefreshAPI } from "../api/auth/authServices";
import { setuserAccessToken, setUserAuthLoaded, logout as    userLogout } from "../store/slices/auth/userAuthSlice";
import { setAdminAccessToken, setAdminAuthLoaded, logout as adminLogout } from "../store/slices/auth/adminAuthSlice";
import { setcompanyAccessToken, setCompanyAuthLoaded, logout as companyLogout } from "../store/slices/auth/companyAuthSlice";

export const authConfig: Record<string, {
  refreshFn: () => Promise<any>;
  setToken: (data: any) => any;
  setLoaded: (val: boolean) => any;
  logout: () => any;
}> = {
  admin: {
    refreshFn: adminRefreshAPI,
    setToken: setAdminAccessToken,
    setLoaded: setAdminAuthLoaded,
    logout: adminLogout,
    
  },
  company: {
    refreshFn: companyRefreshAPI,
    setToken: setcompanyAccessToken,
    setLoaded: setCompanyAuthLoaded,
    logout: companyLogout,
  },
  user: {
    refreshFn: userRefreshAPI,
    setToken: setuserAccessToken,
    setLoaded: setUserAuthLoaded,
    logout: userLogout,
  },
};