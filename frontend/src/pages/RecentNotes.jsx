// pages/RecentNotes.jsx
// Shows notes updated in the last 7 days, sorted by most recent first.

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Clock, StickyNote, Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import noteService from '../services/noteService'
import NoteCard from '../components/NoteCard'
import NoteModal from '../components/NoteModal'
import Loading from '../components/Loading'

const RecentNotes = () => {
  const [notes, setNotes]         = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editNote, setEditNote]   = useState(null)
  const [deleteNote, setDeleteNote] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchNotes = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await noteService.getAllNotes()
      // Filter notes updated within the last 7 days
      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
      const recent = (data.notes || []).filter(n => new Date(n.updatedAt) > sevenDaysAgo)
      setNotes(recent)
    } catch {
      toast.error('Failed to load recent notes.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetchNotes() }, [fetchNotes])

  const handleNoteSuccess = (updatedNote) => {
    setNotes(prev => {
      const exists = prev.find(n => n._id === updatedNote._id)
      if (exists) return prev.map(n => n._id === updatedNote._id ? updatedNote : n)
      return [updatedNote, ...prev]
    })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteNote) return
    setIsDeleting(true)
    try {
      await noteService.deleteNote(deleteNote._id)
      setNotes(prev => prev.filter(n => n._id !== deleteNote._id))
      toast.success('Note deleted.')
    } catch {
      toast.error('Failed to delete note.')
    } finally {
      setIsDeleting(false)
      setDeleteNote(null)
    }
  }

  if (isLoading) return <Loading message="Loading recent notes..." />

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Clock className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-navy">Recent Notes</h1>
        </div>
        <p className="text-secondary text-sm">Notes updated in the last 7 days</p>
      </div>

      {notes.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
          <div className="w-16 h-16 bg-lavender rounded-3xl flex items-center justify-center mx-auto mb-4">
            <StickyNote className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-bold text-navy mb-2">No recent notes</h3>
          <p className="text-secondary text-sm mb-6">Notes updated in the last 7 days will appear here.</p>
          <button
            onClick={() => { setEditNote(null); setModalOpen(true) }}
            className="btn-primary flex items-center gap-2 mx-auto"
          >
            <Plus className="w-4 h-4" /> Create Note
          </button>
        </motion.div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {notes.map((note, index) => (
            <NoteCard
              key={note._id}
              note={note}
              index={index}
              onEdit={(note) => { setEditNote(note); setModalOpen(true) }}
              onDelete={setDeleteNote}
            />
          ))}
        </div>
      )}

      <NoteModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditNote(null) }}
        onSuccess={handleNoteSuccess}
        editNote={editNote}
      />

      {deleteNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-navy/50 backdrop-blur-sm" onClick={() => setDeleteNote(null)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm"
          >
            <h3 className="font-bold text-navy text-lg mb-2">Delete Note?</h3>
            <p className="text-secondary text-sm mb-6">
              Delete <span className="font-semibold text-navy">"{deleteNote?.title}"</span>? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteNote(null)} className="btn-secondary flex-1 text-sm">Cancel</button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="flex-1 btn-danger text-sm"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default RecentNotes
