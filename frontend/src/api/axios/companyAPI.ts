import { createAPI } from "./axiosFactory";
import { companyRefreshAPI } from "../auth/authServices";
import { setcompanyAccessToken, logout } from "../../store/slices/auth/companyAuthSlice";
import store from "../../store/store";

export const companyAPI = createAPI(
  "/company",
  () => store.getState().companyAuth.accessToken,
  companyRefreshAPI,
  setcompanyAccessToken,
  logout
);