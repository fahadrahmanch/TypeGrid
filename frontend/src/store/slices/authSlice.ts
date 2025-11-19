import { createSlice } from "@reduxjs/toolkit";
const authSlice = createSlice({
    name: "auth",
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
export const { setAccessToken, logout,setAuthLoaded } = authSlice.actions;
export default authSlice.reducer;
