const express = require("express");
const router = express.Router();

const {
  createQueue,
  getQueues,
  deleteQueue,
} = require("../controllers/queueController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.get("/", getQueues);

router.post("/create", authMiddleware, adminMiddleware, createQueue);
router.delete("/delete/:queueId", authMiddleware, adminMiddleware, deleteQueue);

module.exports = router;