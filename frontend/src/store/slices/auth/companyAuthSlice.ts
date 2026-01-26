import { createSlice } from "@reduxjs/toolkit";
const companyAuthSlice = createSlice({
  name: "companyAuth",
  initialState: {
    accessToken: null,
    authLoaded: false,
    user: null,
    company: null,
  },
  reducers: {
    setcompanyAccessToken(state, action) {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
    },
    setCompany(state, action) {
      
      state.company = action.payload.company;
    },
    setCompanyAuthLoaded(state, action) {
      state.authLoaded = action.payload;
    },
    logout(state) {
      state.accessToken = null;
    },
  },
});
export const {
  setcompanyAccessToken,
  setCompany,
  logout,
  setCompanyAuthLoaded,
} = companyAuthSlice.actions;
export default companyAuthSlice.reducer;
