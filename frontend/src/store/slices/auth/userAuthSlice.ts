import { createSlice } from "@reduxjs/toolkit";
const userAuthSlice = createSlice({
    name: "userAuth",
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
export const { setAccessToken, logout,setAuthLoaded } = userAuthSlice.actions;
export default userAuthSlice.reducer;
