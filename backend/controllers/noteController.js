// controllers/noteController.js
// Handles all CRUD operations for Notes.
// Every operation enforces:
//   1. Authentication (req.user is verified via protect middleware).
//   2. Ownership authorization (note.user must strictly match req.user._id).
//
// Endpoints:
//   createNote    → POST   /api/notes/create (or /api/notes)
//   getAllNotes   → GET    /api/notes/read   (or /api/notes)
//   getNoteById   → GET    /api/notes/read/:id (or /api/notes/:id)
//   updateNote    → PUT    /api/notes/update/:id (or /api/notes/:id)
//   deleteNote    → DELETE /api/notes/delete/:id (or /api/notes/:id)

const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const Note = require("../models/Note");

// ─── Helper: Validate MongoDB ObjectId ───────────────────────────────────────
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// ── CREATE NOTE ───────────────────────────────────────────────────────────────
// POST /api/notes/create
const createNote = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }

  try {
    const { title, content } = req.body;

    // Associate strictly with the authenticated user ID from JWT
    const note = await Note.create({
      title: title.trim(),
      content: content.trim(),
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Note created successfully.",
      note,
    });
  } catch (error) {
    console.error("Create note error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating note.",
    });
  }
};

// ── GET ALL NOTES ─────────────────────────────────────────────────────────────
// GET /api/notes/read
// Returns ONLY the notes belonging to the authenticated user.
// Supports optional query search: GET /api/notes/read?search=keyword
const getAllNotes = async (req, res) => {
  try {
    const filter = { user: req.user._id };

    // Backend search support
    const searchTerm = req.query.search || req.query.q;
    if (searchTerm && typeof searchTerm === "string" && searchTerm.trim()) {
      const regex = new RegExp(searchTerm.trim(), "i");
      filter.$or = [{ title: regex }, { content: regex }];
    }

    const notes = await Note.find(filter).sort({
      updatedAt: -1, // Latest-updated notes appear first
    });

    res.status(200).json({
      success: true,
      count: notes.length,
      notes,
    });
  } catch (error) {
    console.error("Get all notes error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching notes.",
    });
  }
};

// ── GET NOTE BY ID ────────────────────────────────────────────────────────────
// GET /api/notes/read/:id
const getNoteById = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid note ID format.",
    });
  }

  try {
    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found.",
      });
    }

    // Strict ownership verification
    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this note.",
      });
    }

    res.status(200).json({
      success: true,
      note,
    });
  } catch (error) {
    console.error("Get note by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching note.",
    });
  }
};

// ── UPDATE NOTE ───────────────────────────────────────────────────────────────
// PUT /api/notes/update/:id
const updateNote = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }

  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid note ID format.",
    });
  }

  try {
    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found.",
      });
    }

    // Strict ownership verification
    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this note.",
      });
    }

    const { title, content } = req.body;

    const updates = {};
    if (title !== undefined) updates.title = title.trim();
    if (content !== undefined) updates.content = content.trim();

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide a title or content to update.",
      });
    }

    const updatedNote = await Note.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Note updated successfully.",
      note: updatedNote,
    });
  } catch (error) {
    console.error("Update note error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating note.",
    });
  }
};

// ── DELETE NOTE ───────────────────────────────────────────────────────────────
// DELETE /api/notes/delete/:id
const deleteNote = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid note ID format.",
    });
  }

  try {
    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found.",
      });
    }

    // Strict ownership verification
    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this note.",
      });
    }

    await Note.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Note deleted successfully.",
      deletedNoteId: id,
    });
  } catch (error) {
    console.error("Delete note error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting note.",
    });
  }
};

module.exports = {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
};
