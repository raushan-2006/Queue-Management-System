const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getProfile,
  getAllUsers,
  getAllDoctors,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authMiddleware, getProfile);
router.get("/users", authMiddleware, adminMiddleware, getAllUsers);
router.get("/doctors", authMiddleware, getAllDoctors);

module.exports = router;