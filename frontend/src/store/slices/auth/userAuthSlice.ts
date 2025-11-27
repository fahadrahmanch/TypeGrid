import { createSlice } from "@reduxjs/toolkit";
const userAuthSlice = createSlice({
  name: "userAuth",
  initialState: {
    accessToken: null,
    authLoaded: false,
  },
  reducers: {
    setuserAccessToken(state, action) {
      state.accessToken = action.payload.accessToken;
    },
    setUserAuthLoaded(state, action) {
      state.authLoaded = action.payload;
    },
    logout(state) {
      state.accessToken = null;
    },
  },
});
export const { setuserAccessToken, logout, setUserAuthLoaded } =
  userAuthSlice.actions;
export default userAuthSlice.reducer;
