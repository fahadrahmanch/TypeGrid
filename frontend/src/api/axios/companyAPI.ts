import { createAPI } from "./axiosFactory";
import { companyRefreshAPI } from "../auth/authServices";
import { setAccessToken as setcompanyAccessToken, logout } from "../../store/slices/auth/authSlice";
import { store } from "../../store/store";

export const companyAPI = createAPI(
  "/company",
  () => store.getState().auth.accessToken,
  companyRefreshAPI,
  setcompanyAccessToken,
  logout
);
