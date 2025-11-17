import axios from 'axios'
import { useAuthStore } from '../../store/useAuthStore'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/',
  withCredentials: false,
  headers: { 'Content-Type': 'application/json' }
})

// --- REQUEST INTERCEPTOR (ATTACH ACCESS TOKEN) ---
client.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// --- RESPONSE INTERCEPTOR (AUTO LOGOUT ON 401) ---
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear tokens and user state
      useAuthStore.getState().logout()
    }
    return Promise.reject(error)
  }
)

export default client

