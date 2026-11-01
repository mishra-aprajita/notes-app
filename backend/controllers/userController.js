// controllers/userController.js
// Handles all authentication and user-related business logic.
//
// Endpoints:
//   registerUser       → POST /api/users/register
//   loginUser          → POST /api/users/login
//   logoutUser         → POST /api/users/logout
//   getMe              → GET  /api/users/me (protected)
//   getAllUsersAdmin   → GET  /api/users/admin/all (admin only)

const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/User");

const JWT_SECRET =
  process.env.JWT_SECRET || "notespace_fallback_dev_secret_key_32chars";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

// ─── Helper: Generate JWT ────────────────────────────────────────────────────
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

// ─── Helper: Safe user object (never leak password hash) ──────────────────────
const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

// ── REGISTER ─────────────────────────────────────────────────────────────────
// POST /api/users/register
const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }

  try {
    const { name, email, password } = req.body;

    const normalizedEmail = email.trim().toLowerCase();

    // Check for duplicate email
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    // Always create with role 'user' — never allow client to assign 'admin'
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: "user",
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: "Account created successfully. Welcome to NoteSpace!",
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Register error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error during registration. Please try again.",
    });
  }
};

// ── LOGIN ─────────────────────────────────────────────────────────────────────
// POST /api/users/login
const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }

  try {
    const { email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    // Must explicitly select '+password' because schema sets select: false
    const user = await User.findOne({ email: normalizedEmail }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: "Login successful. Welcome back!",
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login. Please try again.",
    });
  }
};

// ── LOGOUT ────────────────────────────────────────────────────────────────────
// POST /api/users/logout
const logoutUser = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logged out successfully. Please clear your token on the client side.",
  });
};

// ── GET ME ────────────────────────────────────────────────────────────────────
// GET /api/users/me (protected)
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching profile.",
    });
  }
};

// ── ADMIN: GET ALL USERS ──────────────────────────────────────────────────────
// GET /api/users/admin/all (admin only)
const getAllUsersAdmin = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: users.length,
      users: users.map(sanitizeUser),
    });
  } catch (error) {
    console.error("Admin fetch users error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching users.",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  getAllUsersAdmin,
};
