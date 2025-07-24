const Message = require("../models/Message");

sendMessage = async (req, res) => {
  const { chatId, text } = req.body;

  try {
    const message = await Message.create({
      chatId,
      sender: req.user._id,
      text,
    });

    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: "Message send error", error });
  }
};

getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chatId: req.params.chatId })
      .populate("sender", "name email")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports={
    sendMessage,
    getMessages,
}