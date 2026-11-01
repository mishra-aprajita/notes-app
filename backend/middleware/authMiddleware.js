// middleware/authMiddleware.js
// Protects routes that require an authenticated user.
//
// How it works:
//   1. Reads JWT from the "Authorization: Bearer <token>" header or "x-auth-token".
//   2. Verifies the signature and expiry using jwt.verify().
//   3. Fetches user from DB to confirm they still exist.
//   4. Attaches the user object to req.user so downstream controllers have access.
//   5. Rejects invalid / expired tokens with a 401 Unauthorized response.

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET =
  process.env.JWT_SECRET || "notespace_fallback_dev_secret_key_32chars";

const protect = async (req, res, next) => {
  let token;

  // Check Bearer token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    const parts = req.headers.authorization.split(" ");
    if (parts.length === 2) {
      token = parts[1].trim();
    }
  } else if (req.headers["x-auth-token"]) {
    // Support x-auth-token header as common alternative
    token = req.headers["x-auth-token"];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided. Please log in.",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Support both `id`, `_id`, and `userId` payload formats
    const userId = decoded.id || decoded._id || decoded.userId;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "The user belonging to this token no longer exists.",
      });
    }

    // Attach authenticated user to the request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Your session has expired. Please log in again.",
      });
    }
    return res.status(401).json({
      success: false,
      message: "Invalid token. Please log in again.",
    });
  }
};

module.exports = { protect };
