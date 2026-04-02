import { createAPI } from "./axiosFactory";
import { adminRefreshAPI } from "../auth/authServices";
import {
  setAccessToken as setAdminAccessToken,
  logout,
} from "../../store/slices/auth/authSlice";
import { store } from "../../store/store";

export const adminAPI = createAPI(
  "/admin",
  () => store.getState().auth.accessToken,
  adminRefreshAPI,
  setAdminAccessToken,
  logout,
);
