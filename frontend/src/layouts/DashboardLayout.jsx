// layouts/DashboardLayout.jsx
// Wraps all authenticated dashboard pages.
// Provides the Sidebar and a top navigation bar.

import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Menu, Plus, Bell } from 'lucide-react'
import { motion } from 'framer-motion'
import Sidebar from '../components/Sidebar'
import useAuth from '../hooks/useAuth'

const DashboardLayout = ({ onCreateNote }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="flex h-screen bg-[#F7F8FC] overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navigation */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-6 shrink-0 shadow-nav">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-secondary hover:text-navy hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:block">
              <p className="text-secondary text-sm">
                {getGreeting()},{' '}
                <span className="text-navy font-semibold">{user?.name?.split(' ')[0]}</span> 👋
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Create Note Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onCreateNote && onCreateNote()}
              className="btn-primary text-sm flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Note</span>
            </motion.button>

            {/* User Avatar */}
            <div
              className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-sm cursor-pointer ml-1"
              onClick={() => navigate('/dashboard/profile')}
              title="Profile"
            >
              <span className="text-white font-semibold text-sm">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
