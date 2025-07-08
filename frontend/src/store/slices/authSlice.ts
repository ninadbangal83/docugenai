// src/store/slices/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, User } from "src/types/User";


// Prevent crash if bad JSON exists
let storedUser: User | null = null;
try {
  const userStr = localStorage.getItem("user");
  storedUser = userStr ? JSON.parse(userStr) : null;
} catch (err) {
  console.error("Failed to parse stored user JSON. Clearing localStorage.");
  localStorage.removeItem("user");
}

const initialState: AuthState = {
  token: localStorage.getItem("token"),
  user: storedUser,
  isAuthenticated: !!localStorage.getItem("token"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user)); // ✅ JSON.stringify
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
