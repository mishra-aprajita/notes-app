// models/Note.js
// Defines the Mongoose schema and model for Note documents.
// Each note references its owner User via an ObjectId (one-to-many relationship).

const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Note title is required"],
      trim: true,
      minlength: [1, "Title cannot be empty"],
      maxlength: [150, "Title cannot exceed 150 characters"],
    },
    content: {
      type: String,
      required: [true, "Note content is required"],
      trim: true,
      minlength: [1, "Content cannot be empty"],
    },
    // ── User-Note Relationship ─────────────────────────────────────────────
    // This ObjectId ties every note to exactly one user.
    // We NEVER accept this from the frontend — it is always set from
    // the verified JWT token inside the controller.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// Index for faster queries when fetching all notes for a specific user
noteSchema.index({ user: 1, updatedAt: -1 });

const Note = mongoose.model("Note", noteSchema);
module.exports = Note;
