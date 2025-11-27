import { createSlice } from "@reduxjs/toolkit";
const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState: {
    accessToken: null,
    admin: null,
    authLoaded: false,
  },
  reducers: {
    setAdminAccessToken(state, action) {
      state.accessToken = action.payload.accessToken;
      state.admin = action.payload.admin;
    },
    setAdminAuthLoaded(state, action) {
      state.authLoaded = action.payload;
    },
    logout(state) {
      state.accessToken = null;
      state.admin = null;
    },
  },
});
export const { setAdminAccessToken, logout, setAdminAuthLoaded } =
  adminAuthSlice.actions;
export default adminAuthSlice.reducer;
