// components/NoteCard.jsx
// Displays an individual note in the dashboard grid.
// Shows title, content preview, timestamps, and action buttons.

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MoreVertical, Edit3, Trash2, Eye, Clock } from 'lucide-react'

// Soft pastel colors that cycle through notes
const NOTE_COLORS = [
  { bg: 'bg-violet-50', border: 'border-violet-100', dot: 'bg-violet-400' },
  { bg: 'bg-sky-50',    border: 'border-sky-100',    dot: 'bg-sky-400'    },
  { bg: 'bg-emerald-50',border: 'border-emerald-100',dot: 'bg-emerald-400'},
  { bg: 'bg-amber-50',  border: 'border-amber-100',  dot: 'bg-amber-400'  },
  { bg: 'bg-pink-50',   border: 'border-pink-100',   dot: 'bg-pink-400'   },
  { bg: 'bg-orange-50', border: 'border-orange-100', dot: 'bg-orange-400' },
]

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const getTimeAgo = (dateStr) => {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return formatDate(dateStr)
}

const NoteCard = ({ note, index, onDelete, onEdit }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const color = NOTE_COLORS[index % NOTE_COLORS.length]

  const handleView = () => navigate(`/dashboard/notes/${note._id}`)
  const handleEdit = () => {
    setMenuOpen(false)
    onEdit(note)
  }
  const handleDelete = () => {
    setMenuOpen(false)
    onDelete(note)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`card card-hover cursor-pointer relative group ${color.bg} border ${color.border}`}
    >
      {/* Color dot */}
      <div className={`absolute top-4 left-4 w-2 h-2 rounded-full ${color.dot}`} />

      {/* Three-dot menu */}
      <div className="absolute top-3 right-3">
        <button
          onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen) }}
          className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-white/80 text-secondary hover:text-navy transition-all"
          aria-label="Note options"
        >
          <MoreVertical className="w-4 h-4" />
        </button>

        {menuOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setMenuOpen(false)}
            />
            <div className="absolute right-0 top-8 bg-white rounded-xl shadow-lg border border-gray-100 z-20 overflow-hidden w-40">
              <button
                onClick={(e) => { e.stopPropagation(); handleView() }}
                className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm text-navy hover:bg-lavender transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-primary" /> View
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleEdit() }}
                className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm text-navy hover:bg-lavender transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5 text-primary" /> Edit
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleDelete() }}
                className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </>
        )}
      </div>

      {/* Card content */}
      <div className="p-5 pt-7" onClick={handleView}>
        <h3 className="font-semibold text-navy text-base mb-2 line-clamp-2 pr-4 leading-snug">
          {note.title}
        </h3>
        <p className="text-secondary text-sm line-clamp-3 leading-relaxed">
          {note.content}
        </p>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-white/60 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-secondary text-xs">
            <Clock className="w-3 h-3" />
            <span>{getTimeAgo(note.updatedAt)}</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => { e.stopPropagation(); handleEdit() }}
              className="p-1.5 rounded-lg text-secondary hover:text-primary hover:bg-white/80 transition-all"
              title="Edit note"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleDelete() }}
              className="p-1.5 rounded-lg text-secondary hover:text-red-500 hover:bg-red-50 transition-all"
              title="Delete note"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default NoteCard
