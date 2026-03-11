import { createAPI } from "./axiosFactory";
import { adminRefreshAPI } from "../auth/authServices";
import { setAdminAccessToken, logout } from "../../store/slices/auth/adminAuthSlice";
import store from "../../store/store";

export const adminAPI = createAPI(
  "/admin",
  () => store.getState().adminAuth.accessToken,
  adminRefreshAPI,
  setAdminAccessToken,
  logout
);