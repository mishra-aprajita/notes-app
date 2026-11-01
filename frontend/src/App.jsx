// App.jsx
// Root application component.
// Sets up React Router with public and protected routes.
//
// Route structure:
//   /                     → Landing page (public)
//   /login                → Login page (public)
//   /register             → Register page (public)
//   /dashboard            → Dashboard overview (protected)
//   /dashboard/notes      → All notes (protected)
//   /dashboard/notes/:id  → Note details (protected)
//   /dashboard/recent     → Recent notes (protected)
//   /dashboard/profile    → User profile (protected)

import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useState } from 'react'

import ProtectedRoute     from './components/ProtectedRoute'
import DashboardLayout    from './layouts/DashboardLayout'

import Landing     from './pages/Landing'
import Login       from './pages/Login'
import Register    from './pages/Register'
import Dashboard   from './pages/Dashboard'
import AllNotes    from './pages/AllNotes'
import NoteDetails from './pages/NoteDetails'
import RecentNotes from './pages/RecentNotes'
import Profile     from './pages/Profile'
import NoteModal   from './components/NoteModal'

import noteService from './services/noteService'
import toast from 'react-hot-toast'

// ── DashboardWrapper ───────────────────────────────────────────────────────────
// Wraps DashboardLayout to manage the "New Note" modal at the top level.
// This lets the header's "New Note" button open the modal from anywhere.
const DashboardWrapper = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [createdNote, setCreatedNote] = useState(null)

  const handleNoteCreated = (note) => {
    // Signal child pages to refresh via key or state if needed
    setCreatedNote(note)
    toast.success('Note created!')
  }

  return (
    <>
      <DashboardLayout onCreateNote={() => setCreateModalOpen(true)} />
      <NoteModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={handleNoteCreated}
        editNote={null}
      />
    </>
  )
}

const App = () => {
  return (
    <>
      {/* Toast notification system */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#151A2D',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            fontSize: '14px',
            fontWeight: '500',
            padding: '12px 16px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
          },
          success: {
            iconTheme: { primary: '#635BFF', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
        }}
      />

      <Routes>
        {/* ── Public Routes ─────────────────────────────────────────────── */}
        <Route path="/"         element={<Landing />}  />
        <Route path="/login"    element={<Login />}    />
        <Route path="/register" element={<Register />} />

        {/* ── Protected Routes ──────────────────────────────────────────── */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardWrapper />}>
            <Route path="/dashboard"              element={<Dashboard />}   />
            <Route path="/dashboard/notes"        element={<AllNotes />}    />
            <Route path="/dashboard/notes/:id"    element={<NoteDetails />} />
            <Route path="/dashboard/recent"       element={<RecentNotes />} />
            <Route path="/dashboard/profile"      element={<Profile />}     />
          </Route>
        </Route>

        {/* ── Catch-all ─────────────────────────────────────────────────── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
