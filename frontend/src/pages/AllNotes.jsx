// pages/AllNotes.jsx
// Shows all user notes with search and edit/delete functionality.
// Reuses shared logic with Dashboard but focuses solely on the notes list.

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { StickyNote, Plus, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import noteService from '../services/noteService'
import NoteCard from '../components/NoteCard'
import NoteModal from '../components/NoteModal'
import SearchBar from '../components/SearchBar'
import Loading from '../components/Loading'

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
        Permanently delete <span className="font-semibold text-navy">"{note?.title}"</span>? This cannot be undone.
      </p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="btn-secondary flex-1 text-sm">Cancel</button>
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

const SkeletonCard = () => (
  <div className="card p-5 space-y-3">
    <div className="skeleton h-4 rounded-lg w-3/4" />
    <div className="skeleton h-3 rounded-lg w-full" />
    <div className="skeleton h-3 rounded-lg w-5/6" />
    <div className="skeleton h-3 rounded-lg w-2/3" />
  </div>
)

const AllNotes = () => {
  const [notes, setNotes]         = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editNote, setEditNote]   = useState(null)
  const [deleteNote, setDeleteNote] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchNotes = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await noteService.getAllNotes()
      setNotes(data.notes || [])
    } catch {
      toast.error('Failed to load notes.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetchNotes() }, [fetchNotes])

  const filteredNotes = notes.filter(n => {
    const q = searchQuery.toLowerCase()
    return n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
  })

  const handleNoteSuccess = (updatedNote) => {
    setNotes(prev => {
      const exists = prev.find(n => n._id === updatedNote._id)
      if (exists) return prev.map(n => n._id === updatedNote._id ? updatedNote : n)
      return [updatedNote, ...prev]
    })
  }

  const handleDeleteConfirm = async () => {
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

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy mb-1">All Notes</h1>
          <p className="text-secondary text-sm">
            {isLoading ? 'Loading...' : `${notes.length} note${notes.length !== 1 ? 's' : ''} in your collection`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <button
            onClick={fetchNotes}
            className="p-2.5 rounded-xl border border-gray-200 bg-white text-secondary hover:text-primary transition-all"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => { setEditNote(null); setModalOpen(true) }}
            className="btn-primary text-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> New
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {!isLoading && filteredNotes.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div className="w-16 h-16 bg-lavender rounded-3xl flex items-center justify-center mx-auto mb-4">
            <StickyNote className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-bold text-navy mb-2">
            {searchQuery ? 'No results found' : 'No notes yet'}
          </h3>
          <p className="text-secondary text-sm mb-6">
            {searchQuery ? `Try different keywords.` : 'Create your first note to get started.'}
          </p>
          {!searchQuery && (
            <button
              onClick={() => { setEditNote(null); setModalOpen(true) }}
              className="btn-primary flex items-center gap-2 mx-auto"
            >
              <Plus className="w-4 h-4" /> Create Note
            </button>
          )}
        </motion.div>
      )}

      {!isLoading && filteredNotes.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredNotes.map((note, index) => (
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

export default AllNotes
