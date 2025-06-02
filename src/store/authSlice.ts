import { createSlice } from "@reduxjs/toolkit"

interface AuthState {
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
  isLoading: true,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.token = action.payload
      state.isAuthenticated = true
      state.isLoading = false
    },
    logout(state) {
      state.token = null
      state.isAuthenticated = false
      state.isLoading = false
      localStorage.removeItem("token")
      sessionStorage.removeItem("token")
    },
    initializeAuth(state) {
      const storedToken = localStorage.getItem("token") || sessionStorage.getItem("token")
      if (storedToken) {
        state.token = storedToken
        state.isAuthenticated = true
      }
      state.isLoading = false
    },
  },
})

export const { loginSuccess, logout, initializeAuth } = authSlice.actions
export default authSlice.reducer
