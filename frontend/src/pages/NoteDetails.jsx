// pages/NoteDetails.jsx
// View a single note fetched by its ID from the backend.
// Provides Edit and Delete options with ownership verification on the server.

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Edit3, Trash2, Calendar, Clock,
  Loader2, RefreshCw, AlertCircle
} from 'lucide-react'
import toast from 'react-hot-toast'
import noteService from '../services/noteService'
import NoteModal from '../components/NoteModal'
import Loading from '../components/Loading'

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

const NoteDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [note, setNote]           = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError]         = useState(null)
  const [editOpen, setEditOpen]   = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchNote = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await noteService.getNoteById(id)
      setNote(data.note)
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to load note.'
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchNote() }, [id])

  const handleNoteUpdated = (updatedNote) => {
    setNote(updatedNote)
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await noteService.deleteNote(id)
      toast.success('Note deleted.')
      navigate('/dashboard')
    } catch {
      toast.error('Failed to delete note.')
    } finally {
      setIsDeleting(false)
      setShowDelete(false)
    }
  }

  if (isLoading) return <Loading message="Loading note..." />

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-3xl flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-navy mb-2">Note Not Found</h3>
        <p className="text-secondary mb-6 max-w-xs">{error}</p>
        <button onClick={() => navigate('/dashboard')} className="btn-primary">
          Back to Dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-secondary hover:text-navy transition-colors mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        <span className="text-sm font-medium">Back</span>
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-8"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-navy leading-tight">
            {note.title}
          </h1>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setEditOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-lavender text-primary text-sm font-medium hover:bg-lavender-dark transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit
            </button>
            <button
              onClick={() => setShowDelete(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </div>
        </div>

        {/* Timestamps */}
        <div className="flex flex-wrap gap-4 mb-8 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-2 text-secondary text-sm">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            <span>Created: {formatDate(note.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2 text-secondary text-sm">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span>Updated: {formatDate(note.updatedAt)}</span>
          </div>
        </div>

        {/* Content */}
        <div className="text-navy leading-relaxed whitespace-pre-wrap text-base">
          {note.content}
        </div>
      </motion.div>

      {/* Edit Modal */}
      <NoteModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        onSuccess={handleNoteUpdated}
        editNote={note}
      />

      {/* Delete Confirmation */}
      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-navy/50 backdrop-blur-sm" onClick={() => setShowDelete(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm"
          >
            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
              <span className="text-2xl">🗑️</span>
            </div>
            <h3 className="font-bold text-navy text-lg mb-2">Delete Note?</h3>
            <p className="text-secondary text-sm mb-6">
              This will permanently delete <span className="font-semibold text-navy">"{note.title}"</span>. Cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowDelete(false)} className="btn-secondary flex-1 text-sm">
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 btn-danger text-sm flex items-center justify-center gap-2"
              >
                {isDeleting
                  ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Deleting...</>
                  : 'Delete'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default NoteDetails
