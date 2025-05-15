const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    senderUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipientUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const MessageModel = mongoose.model("Message", MessageSchema);

module.exports = MessageModel;
