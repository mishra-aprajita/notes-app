// context/AuthContext.jsx
// Global authentication state management using React Context.
//
// Provides:
//   - user          → current authenticated user (or null)
//   - token         → JWT string (or null)
//   - isLoading     → true while checking persisted auth on first load
//   - login()       → stores token + user, updates state
//   - logout()      → clears token + user, redirects
//   - updateUser()  → refreshes user data in context

import { createContext, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import authService from '../services/authService'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null)
  const [token, setToken]     = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  // ─── On mount: Restore session from localStorage ──────────────────────────
  // If the user had previously logged in and a token is stored,
  // restore their session without requiring them to log in again.
  useEffect(() => {
    const storedToken = localStorage.getItem('notespace_token')
    const storedUser  = localStorage.getItem('notespace_user')

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setToken(storedToken)
        setUser(parsedUser)
      } catch {
        // If stored data is corrupted, clear it
        localStorage.removeItem('notespace_token')
        localStorage.removeItem('notespace_user')
      }
    }
    setIsLoading(false)
  }, [])

  // ─── Login ────────────────────────────────────────────────────────────────
  // Called after a successful login API response.
  // Persists the token and user data to localStorage so the session
  // survives page refreshes.
  const login = useCallback((authData) => {
    const { token: newToken, user: newUser } = authData
    localStorage.setItem('notespace_token', newToken)
    localStorage.setItem('notespace_user', JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
  }, [])

  // ─── Logout ───────────────────────────────────────────────────────────────
  // Clears all auth state and redirects to the landing page.
  // Because JWT is stateless, clearing the client-side token is sufficient
  // to end the session for this client.
  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } catch {
      // Even if the server call fails, we still clear client-side state
    } finally {
      localStorage.removeItem('notespace_token')
      localStorage.removeItem('notespace_user')
      setToken(null)
      setUser(null)
      toast.success('Logged out successfully.')
      navigate('/')
    }
  }, [navigate])

  // ─── Update User ──────────────────────────────────────────────────────────
  const updateUser = useCallback((updatedUser) => {
    localStorage.setItem('notespace_user', JSON.stringify(updatedUser))
    setUser(updatedUser)
  }, [])

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token,
    login,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
