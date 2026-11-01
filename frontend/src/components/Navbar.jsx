// components/Navbar.jsx
// Public-facing navigation bar shown on the Landing page.
// Shows login and register links for unauthenticated visitors.

import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen } from 'lucide-react'
import useAuth from '../hooks/useAuth'

const Navbar = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-navy text-xl tracking-tight">
            Note<span className="text-primary">Space</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-primary text-sm"
            >
              Go to Dashboard
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="text-secondary hover:text-navy font-medium text-sm transition-colors px-4 py-2 rounded-lg hover:bg-gray-50"
              >
                Login
              </Link>
              <Link to="/register" className="btn-primary text-sm">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar
