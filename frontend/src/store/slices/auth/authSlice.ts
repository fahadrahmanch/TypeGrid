import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    accessToken: null,
    authLoaded: false,
    user: null,
    keyboardLayout: "qwerty",
  },
  reducers: {
    setAccessToken(state, action) {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      if (action.payload.user?.KeyBoardLayout) {
        state.keyboardLayout = action.payload.user.KeyBoardLayout.toLowerCase();
      }
    },
    setAuthLoaded(state, action) {
      state.authLoaded = action.payload;
    },
    setKeyboardLayout(state, action) {
      state.keyboardLayout = action.payload;
    },
    logout(state) {
      state.accessToken = null;
      state.user = null;
      state.keyboardLayout = "qwerty";
    },
  },
});

export const { setAccessToken, setAuthLoaded, setKeyboardLayout, logout } = authSlice.actions;
export default authSlice.reducer;
