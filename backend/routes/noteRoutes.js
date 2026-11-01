// routes/noteRoutes.js
// Maps HTTP endpoints to note controller functions.
// All note routes require valid JWT authentication via "protect" middleware.

const express = require("express");
const { body } = require("express-validator");
const { protect } = require("../middleware/authMiddleware");
const {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
} = require("../controllers/noteController");

const router = express.Router();

// ─── Validation Rules ─────────────────────────────────────────────────────────

const createValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Note title is required")
    .isLength({ max: 150 })
    .withMessage("Title cannot exceed 150 characters"),

  body("content")
    .trim()
    .notEmpty()
    .withMessage("Note content is required"),
];

const updateValidation = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isLength({ max: 150 })
    .withMessage("Title cannot exceed 150 characters"),

  body("content")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Content cannot be empty"),
];

// ─── Master Prompt Required Routes (Part 6) ───────────────────────────────────
router.post("/create", protect, createValidation, createNote);
router.get("/read", protect, getAllNotes);
router.get("/read/:id", protect, getNoteById);
router.put("/update/:id", protect, updateValidation, updateNote);
router.delete("/delete/:id", protect, deleteNote);

// ─── Standard REST Aliases (Supports Postman & standard API clients) ──────────
router.post("/", protect, createValidation, createNote);
router.get("/", protect, getAllNotes);
router.get("/:id", protect, getNoteById);
router.put("/:id", protect, updateValidation, updateNote);
router.delete("/:id", protect, deleteNote);

module.exports = router;
