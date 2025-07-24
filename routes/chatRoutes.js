const express = require("express");
const router = express.Router();
const { accessChat, getUserChats } = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, accessChat); // create or get chat
router.get("/", protect, getUserChats); // all chats of user

module.exports = router;
