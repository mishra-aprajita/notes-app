// services/noteService.js
// All note-related API calls.
// The JWT is automatically attached by the Axios interceptor in api.js.

import api from './api'

// ── Create Note ───────────────────────────────────────────────────────────────
// POST /api/notes/create
const createNote = async (noteData) => {
  const response = await api.post('/notes/create', noteData)
  return response.data
}

// ── Get All Notes ─────────────────────────────────────────────────────────────
// GET /api/notes/read
// Returns only notes belonging to the authenticated user.
const getAllNotes = async () => {
  const response = await api.get('/notes/read')
  return response.data
}

// ── Get Note By ID ────────────────────────────────────────────────────────────
// GET /api/notes/read/:id
const getNoteById = async (id) => {
  const response = await api.get(`/notes/read/${id}`)
  return response.data
}

// ── Update Note ───────────────────────────────────────────────────────────────
// PUT /api/notes/update/:id
const updateNote = async (id, noteData) => {
  const response = await api.put(`/notes/update/${id}`, noteData)
  return response.data
}

// ── Delete Note ───────────────────────────────────────────────────────────────
// DELETE /api/notes/delete/:id
const deleteNote = async (id) => {
  const response = await api.delete(`/notes/delete/${id}`)
  return response.data
}

const noteService = { createNote, getAllNotes, getNoteById, updateNote, deleteNote }
export default noteService
