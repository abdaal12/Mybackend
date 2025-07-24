const express = require("express");
const router = express.Router();
const {
  sendMessage,
  getMessages,
} = require("../controllers/messageController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, sendMessage); // send message
router.get("/:chatId", protect, getMessages); // fetch chat messages

module.exports = router;
