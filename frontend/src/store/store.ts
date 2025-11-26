import { configureStore } from "@reduxjs/toolkit";
import userAuth from "./slices/auth/userAuthSlice";
import adminAuth from "./slices/auth/adminAuthSlice"
const store = configureStore({
    reducer: {
        userAuth: userAuth,
        adminAuth:adminAuth
    }
});
export default store;