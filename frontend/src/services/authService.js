// services/authService.js
// All authentication-related API calls.
// Uses the central Axios instance from api.js which handles token attachment.

import api from './api'

// ── Register ──────────────────────────────────────────────────────────────────
// POST /api/users/register
// Sends name, email, password to create a new account.
const register = async (userData) => {
  const response = await api.post('/users/register', userData)
  return response.data
}

// ── Login ─────────────────────────────────────────────────────────────────────
// POST /api/users/login
// Returns a JWT token and user object on success.
const login = async (credentials) => {
  const response = await api.post('/users/login', credentials)
  return response.data
}

// ── Logout ────────────────────────────────────────────────────────────────────
// POST /api/users/logout
// Signals the server (for logging / future token blacklisting).
// The real logout action is performed on the client by clearing the token.
const logout = async () => {
  const response = await api.post('/users/logout')
  return response.data
}

// ── Get Current User ──────────────────────────────────────────────────────────
// GET /api/users/me
// Fetches the authenticated user's profile using the stored token.
const getMe = async () => {
  const response = await api.get('/users/me')
  return response.data
}

const authService = { register, login, logout, getMe }
export default authService
