// middleware/roleMiddleware.js
// Authorization middleware that restricts access to specific roles.
//
// Usage: router.get('/admin/route', protect, restrictTo('admin'), handler)

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action.",
      });
    }
    next();
  };
};

module.exports = {
  restrictTo,
  roleMiddleware: restrictTo,
};
