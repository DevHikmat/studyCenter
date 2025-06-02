import axios from "axios"

const API_BASE_URL = "https://airedale-enabling-polliwog.ngrok-free.app/api"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "*/*",
  },
})

// Tokenni localStorage dan olib har bir so‘rovga qo‘shish
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
