const Chat = require("../models/Chat");
const Message = require("../models/Message");

exports.createChat = async (req, res) => {
  const { userId1, userId2 } = req.body;
  try {
    const existingChat = await Chat.findOne({
      members: { $all: [userId1, userId2] },
    });

    if (existingChat) return res.status(200).json(existingChat);

    const newChat = new Chat({ members: [userId1, userId2] });
    await newChat.save();
    res.status(201).json(newChat);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

exports.sendMessage = async (req, res) => {
  const { chatId, senderId, text } = req.body;
  try {
    const message = new Message({ chatId, senderId, text });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chatId: req.params.chatId });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err.message);
  }
};
