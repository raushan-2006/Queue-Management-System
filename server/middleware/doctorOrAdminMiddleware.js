const doctorOrAdminMiddleware = (req, res, next) => {
  try {
    if (req.user.role !== "doctor" && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Doctor or Admin only.",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = doctorOrAdminMiddleware;