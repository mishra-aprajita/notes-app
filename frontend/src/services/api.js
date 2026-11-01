// services/api.js
// Centralized Axios instance with interceptors.
//
// ─── What this does ──────────────────────────────────────────────────────────
// 1. Sets the backend base URL from the environment variable VITE_API_URL.
// 2. Attaches the stored JWT token to every outgoing request automatically
//    via the request interceptor — so individual service functions don't need to.
// 3. Intercepts 401 responses — if the server rejects the token (expired / invalid),
//    the user's token and profile are cleared and they are redirected to login.

import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10-second timeout
})

// ─── Request Interceptor ──────────────────────────────────────────────────────
// Attaches the JWT Bearer token to every request that goes to the backend.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('notespace_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ─── Response Interceptor ─────────────────────────────────────────────────────
// Handles authentication errors globally.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token is expired or invalid — clean up and redirect to login
      localStorage.removeItem('notespace_token')
      localStorage.removeItem('notespace_user')
      // Only redirect if not already on an auth page
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
