const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

// Ensure a unique chat exists for a given pair of users
chatSchema.index({ participants: 1 }, { unique: false });

module.exports = mongoose.model("Chat", chatSchema);
