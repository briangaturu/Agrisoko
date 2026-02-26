import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UserInfo {
  userId: string;
  email: string;
  
}

interface AuthState {
  user: UserInfo | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    // ✅ Save login data
    setCredentials: (
      state,
      action: PayloadAction<{
        token: string;
        userId: string;
        email: string;
        fullName: string;
      }>
    ) => {
      state.user = {
        userId: action.payload.userId,
        email: action.payload.email,
        
      };

      state.token = action.payload.token;
      state.isAuthenticated = true;

      // Store token in browser
      localStorage.setItem("token", action.payload.token);
    },

    // ✅ Logout
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      localStorage.removeItem("token");
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;

export default authSlice.reducer;