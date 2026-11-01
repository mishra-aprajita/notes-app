// pages/Dashboard.jsx
// Main dashboard — shows overview stats and the notes grid.
// Fetches real notes from MongoDB through the backend API.

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { FileText, Clock, Plus, StickyNote, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import noteService from '../services/noteService'
import NoteCard from '../components/NoteCard'
import NoteModal from '../components/NoteModal'
import SearchBar from '../components/SearchBar'
import Loading from '../components/Loading'
import useAuth from '../hooks/useAuth'

// ── Delete Confirmation Dialog ─────────────────────────────────────────────────
const DeleteDialog = ({ note, onConfirm, onCancel, isLoading }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-navy/50 backdrop-blur-sm" onClick={onCancel} />
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
        Are you sure you want to delete <span className="font-semibold text-navy">"{note?.title}"</span>?
        This action cannot be undone.
      </p>
      <div className="flex gap-3">
        <button onClick={onCancel} disabled={isLoading} className="btn-secondary flex-1 text-sm">
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className="flex-1 btn-danger text-sm flex items-center justify-center gap-2"
        >
          {isLoading ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Deleting...</> : 'Delete'}
        </button>
      </div>
    </motion.div>
  </div>
)

// ── Skeleton Card ──────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="card p-5 space-y-3">
    <div className="skeleton h-4 rounded-lg w-3/4" />
    <div className="skeleton h-3 rounded-lg w-full" />
    <div className="skeleton h-3 rounded-lg w-5/6" />
    <div className="skeleton h-3 rounded-lg w-2/3" />
    <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between">
      <div className="skeleton h-3 rounded-lg w-16" />
      <div className="skeleton h-3 rounded-lg w-12" />
    </div>
  </div>
)

const Dashboard = () => {
  const [notes, setNotes]           = useState([])
  const [isLoading, setIsLoading]   = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [modalOpen, setModalOpen]   = useState(false)
  const [editNote, setEditNote]     = useState(null)
  const [deleteNote, setDeleteNote] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const { user } = useAuth()

  // ── Fetch all notes ──────────────────────────────────────────────────────
  const fetchNotes = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await noteService.getAllNotes()
      setNotes(data.notes || [])
    } catch (error) {
      toast.error('Failed to load notes. Please refresh.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetchNotes() }, [fetchNotes])

  // ── Search filter ────────────────────────────────────────────────────────
  const filteredNotes = notes.filter(note => {
    const q = searchQuery.toLowerCase()
    return (
      note.title.toLowerCase().includes(q) ||
      note.content.toLowerCase().includes(q)
    )
  })

  // ── Handle note created / updated ────────────────────────────────────────
  const handleNoteSuccess = (updatedNote) => {
    setNotes(prev => {
      const exists = prev.find(n => n._id === updatedNote._id)
      if (exists) {
        return prev.map(n => n._id === updatedNote._id ? updatedNote : n)
      }
      return [updatedNote, ...prev]
    })
  }

  // ── Handle delete ────────────────────────────────────────────────────────
  const handleDeleteConfirm = async () => {
    if (!deleteNote) return
    setIsDeleting(true)
    try {
      await noteService.deleteNote(deleteNote._id)
      setNotes(prev => prev.filter(n => n._id !== deleteNote._id))
      toast.success('Note deleted successfully.')
    } catch (error) {
      toast.error('Failed to delete note.')
    } finally {
      setIsDeleting(false)
      setDeleteNote(null)
    }
  }

  const handleEdit = (note) => {
    setEditNote(note)
    setModalOpen(true)
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setEditNote(null)
  }

  // ── Stats ────────────────────────────────────────────────────────────────
  const totalNotes = notes.length
  const recentlyUpdated = notes.filter(n => {
    const diff = new Date() - new Date(n.updatedAt)
    return diff < 24 * 60 * 60 * 1000 // within 24 hours
  }).length

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy mb-1">
          Dashboard
        </h1>
        <p className="text-secondary text-sm">
          {totalNotes === 0
            ? 'Start by creating your first note!'
            : `You have ${totalNotes} note${totalNotes !== 1 ? 's' : ''}.`}
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        {[
          {
            label: 'Total Notes',
            value: isLoading ? '—' : totalNotes,
            icon: FileText,
            color: 'bg-violet-50 text-violet-600',
            bg: 'bg-violet-50',
          },
          {
            label: 'Updated Today',
            value: isLoading ? '—' : recentlyUpdated,
            icon: Clock,
            color: 'bg-sky-50 text-sky-600',
            bg: 'bg-sky-50',
          },
          {
            label: 'Quick Create',
            value: 'New Note',
            icon: Plus,
            color: 'bg-emerald-50 text-emerald-600',
            bg: 'bg-emerald-50',
            onClick: () => { setEditNote(null); setModalOpen(true) },
          },
        ].map(({ label, value, icon: Icon, color, bg, onClick }) => (
          <motion.div
            key={label}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`card p-5 flex items-center gap-4 ${onClick ? 'cursor-pointer hover:shadow-card-hover' : ''}`}
          >
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${bg}`}>
              <Icon className={`w-5 h-5 ${color.split(' ')[1]}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy">{value}</p>
              <p className="text-secondary text-xs mt-0.5">{label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Notes section */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-lg font-semibold text-navy flex items-center gap-2">
            <StickyNote className="w-5 h-5 text-primary" />
            Your Notes
            {!isLoading && notes.length > 0 && (
              <span className="badge bg-lavender text-primary ml-1">{notes.length}</span>
            )}
          </h2>
          <div className="flex items-center gap-3">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <button
              onClick={fetchNotes}
              className="p-2.5 rounded-xl border border-gray-200 bg-white text-secondary hover:text-primary hover:border-primary/30 transition-all"
              title="Refresh notes"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Loading skeletons */}
        {isLoading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && filteredNotes.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 bg-lavender rounded-3xl flex items-center justify-center mx-auto mb-6">
              <StickyNote className="w-9 h-9 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-navy mb-2">
              {searchQuery ? 'No notes found' : 'No notes yet'}
            </h3>
            <p className="text-secondary mb-6 max-w-xs mx-auto">
              {searchQuery
                ? `No notes match "${searchQuery}". Try a different search.`
                : 'Create your first note and start organizing your thoughts.'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => { setEditNote(null); setModalOpen(true) }}
                className="btn-primary flex items-center gap-2 mx-auto"
              >
                <Plus className="w-4 h-4" /> Create First Note
              </button>
            )}
          </motion.div>
        )}

        {/* Notes grid */}
        {!isLoading && filteredNotes.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredNotes.map((note, index) => (
              <NoteCard
                key={note._id}
                note={note}
                index={index}
                onEdit={handleEdit}
                onDelete={setDeleteNote}
              />
            ))}
          </div>
        )}
      </div>

      {/* Note Modal (Create / Edit) */}
      <NoteModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        onSuccess={handleNoteSuccess}
        editNote={editNote}
      />

      {/* Delete Confirmation Dialog */}
      {deleteNote && (
        <DeleteDialog
          note={deleteNote}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteNote(null)}
          isLoading={isDeleting}
        />
      )}
    </div>
  )
}

export default Dashboard
