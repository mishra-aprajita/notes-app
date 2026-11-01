// pages/Profile.jsx
// Displays the authenticated user's profile information.
// Shows account details and a logout button.

import { motion } from 'framer-motion'
import { User, Mail, Shield, Calendar, LogOut } from 'lucide-react'
import useAuth from '../hooks/useAuth'

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0">
    <div className="w-9 h-9 rounded-xl bg-lavender flex items-center justify-center shrink-0">
      <Icon className="w-4 h-4 text-primary" />
    </div>
    <div className="min-w-0">
      <p className="text-secondary text-xs font-medium mb-0.5">{label}</p>
      <p className="text-navy font-semibold text-sm truncate">{value}</p>
    </div>
  </div>
)

const Profile = () => {
  const { user, logout } = useAuth()

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy mb-1">Profile</h1>
        <p className="text-secondary text-sm">Your account information</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        {/* Avatar section */}
        <div className="bg-gradient-to-br from-primary to-purple-600 rounded-t-2xl p-8 text-center">
          <div className="w-24 h-24 rounded-3xl bg-white/20 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white font-bold text-4xl">
              {user?.name?.charAt(0)?.toUpperCase()}
            </span>
          </div>
          <h2 className="text-white font-bold text-2xl">{user?.name}</h2>
          <p className="text-white/70 text-sm mt-1">{user?.email}</p>
          <span className="inline-flex items-center gap-1.5 mt-3 bg-white/20 text-white text-xs font-medium px-3 py-1.5 rounded-full">
            <Shield className="w-3 h-3" />
            {user?.role === 'admin' ? 'Administrator' : 'Member'}
          </span>
        </div>

        {/* Info rows */}
        <div className="px-6 py-2">
          <InfoRow icon={User}     label="Full Name"     value={user?.name} />
          <InfoRow icon={Mail}     label="Email Address" value={user?.email} />
          <InfoRow icon={Shield}   label="Account Role"  value={user?.role === 'admin' ? 'Administrator' : 'User'} />
          <InfoRow icon={Calendar} label="Member Since"  value={user?.createdAt ? formatDate(user.createdAt) : '—'} />
        </div>

        {/* Logout */}
        <div className="px-6 pb-6 pt-2">
          <button
            onClick={logout}
            className="w-full btn-danger flex items-center justify-center gap-2 py-3"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </motion.div>

      {/* Security note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-4 p-4 bg-lavender rounded-2xl"
      >
        <p className="text-primary text-sm font-medium mb-1">🔒 Account Security</p>
        <p className="text-secondary text-xs leading-relaxed">
          Your password is securely hashed using bcrypt and is never stored in plain text.
          Your session is protected by a JWT token that expires after 24 hours.
        </p>
      </motion.div>
    </div>
  )
}

export default Profile
