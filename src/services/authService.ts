// src/api/auth.ts
import api from "./api"

interface LoginPayload {
  username: string
  password: string
  rememberMe: boolean
}

export const login = async (data: LoginPayload) => {
  const response = await api.post("/login", data)
  return response.data
}
