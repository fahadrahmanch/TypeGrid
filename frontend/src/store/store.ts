import { configureStore } from "@reduxjs/toolkit";
import userAuth from "./slices/auth/userAuthSlice";
import adminAuth from "./slices/auth/adminAuthSlice";
import companyAuth from "./slices/auth/companyAuthSlice";
const store = configureStore({
  reducer: {
    userAuth: userAuth,
    adminAuth: adminAuth,
    companyAuth: companyAuth,
  },
});
export default store;
