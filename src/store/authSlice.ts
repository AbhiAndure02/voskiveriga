import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  activeProfile: null, // personal | business
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSession(state, action) {
      state.user = action.payload.user;
      state.activeProfile = action.payload.profile;
      state.isAuthenticated = true;
    },
    switchProfile(state, action) {
      state.activeProfile = action.payload;
    },
    logout(state) {
      return initialState;
    },
  },
});

export const { setSession, switchProfile, logout } = authSlice.actions;
export default authSlice.reducer;
