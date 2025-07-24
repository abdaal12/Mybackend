const Chat = require("../models/Chat");

accessChat = async (req, res) => {
  const { userId } = req.body;

  try {
    let chat = await Chat.findOne({
      participants: { $all: [req.user._id, userId] },
    });

    if (!chat) {
      chat = await Chat.create({ participants: [req.user._id, userId] });
    }

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: "Chat error", error });
  }
};

getUserChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: { $in: [req.user._id] },
    }).populate("participants", "-password");

    res.status(200).json(chats);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports={
  accessChat,
getUserChats,
}