const express = require("express");
const router = express.Router();

const {
  bookToken,
  getTokenStatus,
  callNextToken,
} = require("../controllers/tokenController");

const authMiddleware = require("../middleware/authMiddleware");
const doctorOrAdminMiddleware = require("../middleware/doctorOrAdminMiddleware");

router.post("/book", authMiddleware, bookToken);
router.get("/status/:tokenId", authMiddleware, getTokenStatus);
router.post("/next", authMiddleware, doctorOrAdminMiddleware, callNextToken);

module.exports = router;