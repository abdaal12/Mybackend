const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

router.post("/chat", chatController.createChat);
router.post("/message", chatController.sendMessage);
router.get("/messages/:chatId", chatController.getMessages);

module.exports = router;
