// routes/userRoutes.js
// Maps HTTP endpoints to user controller functions.
// Applies express-validator rules inline for input validation.

const express = require("express");
const { body } = require("express-validator");
const rateLimit = require("express-rate-limit");

const {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  getAllUsersAdmin,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { restrictTo } = require("../middleware/roleMiddleware");

const router = express.Router();

// ─── Rate Limiting ────────────────────────────────────────────────────────────
// In production: 20 attempts per 15 min. In development: 1000 to prevent lockout.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "production" ? 20 : 1000,
  message: {
    success: false,
    message: "Too many authentication requests. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─── Validation Rules ─────────────────────────────────────────────────────────
const registerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email address"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email address"),

  body("password").notEmpty().withMessage("Password is required"),
];

// ─── Routes ───────────────────────────────────────────────────────────────────
router.post("/register", authLimiter, registerValidation, registerUser);
router.post("/login", authLimiter, loginValidation, loginUser);
router.post("/logout", protect, logoutUser);
router.get("/me", protect, getMe);

// Admin-only route demonstrating role-based access control (Part 7)
router.get("/admin/all", protect, restrictTo("admin"), getAllUsersAdmin);

module.exports = router;
