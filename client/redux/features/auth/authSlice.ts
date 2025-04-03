import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: typeof window !== "undefined" ? localStorage.getItem("token") || "" : "",
  user: typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "{}") : "",
};

const authSlice:any = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userRegistration: (state: any, action) => {
      state.token = action.payload.token;
    },
    userLoggedIn: (state, action) => {
      state.token = action.payload.accessToken;
      state.user = action.payload.user;
      
      // Save token and user to local storage
      localStorage.setItem("token", action.payload.accessToken);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    
    userLoggedOut: (state) => {
      state.token = "";
      state.user = "";
    
      // Clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    
  },
});

export const { userRegistration, userLoggedIn, userLoggedOut } =
  authSlice.actions;

export default authSlice.reducer;
