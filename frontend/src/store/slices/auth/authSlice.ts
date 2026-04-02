import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    accessToken: null,
    authLoaded: false,
    user: null,
  },
  reducers: {
    setAccessToken(state, action) {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
    },
    setAuthLoaded(state, action) {
      state.authLoaded = action.payload;
    },
    logout(state) {
      state.accessToken = null;
      state.user = null;
    },
  },
});

export const { setAccessToken, setAuthLoaded, logout } = authSlice.actions;
export default authSlice.reducer;
