// hooks/useAuth.js
// Custom hook that provides convenient access to the AuthContext.
// Throws an error if used outside the AuthProvider, preventing subtle bugs.

import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default useAuth
