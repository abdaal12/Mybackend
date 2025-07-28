const Chat = require("../models/Chat");

// Access or create a one-to-one chat
const accessChat = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    let chat = await Chat.findOne({
      participants: { $all: [req.user._id, userId], $size: 2 },
    });

    if (!chat) {
      chat = await Chat.create({ participants: [req.user._id, userId] });
    }

    chat = await chat.populate("participants", "-password");

    res.status(200).json(chat);
  } catch (error) {
    console.error("Access chat error:", error);
    res.status(500).json({ message: "Chat access failed", error });
  }
};

// Get all chats of a user
const getUserChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user._id,
    })
      .populate("participants", "-password")
      .sort({ updatedAt: -1 });

    res.status(200).json(chats);
  } catch (err) {
    console.error("Get chats error:", err);
    res.status(500).json({ message: "Fetching chats failed", err });
  }
};

module.exports = {
  accessChat,
  getUserChats,
};
