import { createSlice } from "@reduxjs/toolkit";
const adminAuthSlice = createSlice({
    name: "adminAuth",
    initialState: {
        accessToken: null,
        authLoaded:false
    },
    reducers: {
        setAccessToken(state, action) {
            state.accessToken = action.payload.accessToken;
        },
        setAuthLoaded(state, action) {
            state.authLoaded = action.payload;
        },
        logout(state) {
            state.accessToken = null;
        }
    }
});
export const { setAccessToken, logout,setAuthLoaded } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
