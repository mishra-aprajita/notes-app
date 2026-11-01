// components/NoteModal.jsx
// Modal dialog for creating and editing notes.
// Used for both Create and Edit operations.

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, FileText, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import noteService from '../services/noteService'

const MAX_TITLE_LENGTH = 150
const MAX_CONTENT_LENGTH = 5000

const NoteModal = ({ isOpen, onClose, onSuccess, editNote = null }) => {
  const [title, setTitle]         = useState('')
  const [content, setContent]     = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const titleRef = useRef(null)

  const isEditMode = !!editNote

  // Populate fields when editing
  useEffect(() => {
    if (editNote) {
      setTitle(editNote.title || '')
      setContent(editNote.content || '')
    } else {
      setTitle('')
      setContent('')
    }
  }, [editNote, isOpen])

  // Focus title input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => titleRef.current?.focus(), 100)
    }
  }, [isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title.trim()) {
      toast.error('Please enter a note title.')
      return
    }
    if (!content.trim()) {
      toast.error('Please enter note content.')
      return
    }

    setIsLoading(true)
    try {
      let result
      if (isEditMode) {
        result = await noteService.updateNote(editNote._id, { title: title.trim(), content: content.trim() })
        toast.success('Note updated successfully!')
      } else {
        result = await noteService.createNote({ title: title.trim(), content: content.trim() })
        toast.success('Note created successfully!')
      }

      onSuccess(result.note)
      onClose()
    } catch (error) {
      const message = error.response?.data?.message || 'Something went wrong. Please try again.'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setTitle('')
      setContent('')
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-navy/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-lavender rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                <h2 className="font-semibold text-navy text-lg">
                  {isEditMode ? 'Edit Note' : 'New Note'}
                </h2>
              </div>
              <button
                onClick={handleClose}
                disabled={isLoading}
                className="p-2 rounded-lg text-secondary hover:text-navy hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">
                  Title
                </label>
                <input
                  ref={titleRef}
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value.slice(0, MAX_TITLE_LENGTH))}
                  placeholder="Enter note title..."
                  className="input-field text-sm"
                  disabled={isLoading}
                />
                <p className="text-right text-xs text-secondary mt-1">
                  {title.length}/{MAX_TITLE_LENGTH}
                </p>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">
                  Content
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value.slice(0, MAX_CONTENT_LENGTH))}
                  placeholder="Write your note here..."
                  rows={6}
                  className="input-field text-sm resize-none leading-relaxed"
                  disabled={isLoading}
                />
                <p className="text-right text-xs text-secondary mt-1">
                  {content.length}/{MAX_CONTENT_LENGTH}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isLoading}
                  className="btn-secondary flex-1 text-sm disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !title.trim() || !content.trim()}
                  className="btn-primary flex-1 text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                  ) : (
                    <><Save className="w-4 h-4" /> {isEditMode ? 'Update Note' : 'Save Note'}</>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default NoteModal
