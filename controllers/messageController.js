const Message = require("../models/Message");

// Send a message in a one-to-one chat
const sendMessage = async (req, res) => {
  const { chatId, text } = req.body;

  if (!chatId || !text) {
    return res.status(400).json({ message: "chatId and text are required" });
  }

  try {
    const newMessage = await Message.create({
      chatId,
      sender: req.user._id,
      text,
    });

    const populatedMessage = await newMessage.populate("sender", "name email");

    res.status(200).json(populatedMessage);
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({ message: "Message send failed", error });
  }
};

// Get all messages of a chat
const getMessages = async (req, res) => {
  const { chatId } = req.params;

  if (!chatId) {
    return res.status(400).json({ message: "Chat ID is required" });
  }

  try {
    const messages = await Message.find({ chatId })
      .populate("sender", "name email")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({ message: "Failed to fetch messages", error });
  }
};

module.exports = {
  sendMessage,
  getMessages,
};
