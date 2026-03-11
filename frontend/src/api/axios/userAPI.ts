import { createAPI } from "./axiosFactory";
import { userRefreshAPI } from "../auth/authServices";
import { setuserAccessToken, logout } from "../../store/slices/auth/userAuthSlice";
import store from "../../store/store";

export const userAPI = createAPI(
  "/user",
  () => store.getState().userAuth.accessToken,
  userRefreshAPI,
  setuserAccessToken,
  logout
);