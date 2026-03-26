import { createAPI } from "./axiosFactory";
import { userRefreshAPI } from "../auth/authServices";
import { setAccessToken as setuserAccessToken, logout } from "../../store/slices/auth/authSlice";
import { store } from "../../store/store";

export const userAPI = createAPI(
  "/user",
  () => store.getState().auth.accessToken,
  userRefreshAPI,
  setuserAccessToken,
  logout
);