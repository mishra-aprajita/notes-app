// components/ProtectedRoute.jsx
// Wraps pages that require authentication.
// If the user is not logged in, redirects them to /login.
// Shows a loading spinner while the auth state is being restored from storage.

import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import Loading from './Loading'

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <Loading fullScreen message="Restoring your session..." />
  }

  if (!isAuthenticated) {
    // Replace history so the user can't go "back" to the protected page
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
