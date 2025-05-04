const express = require("express");
const router = express.Router();
const Message = require("../models/requestsModel");

// GET /acceptedUsers - Return sender's name, recipient's name, and recipientUserId for accepted messages
router.get("/acceptedUsers", async (req, res) => {
  try {
    const acceptedMessages = await Message.find({ status: "accepted" })
      .populate("senderUserId", "fullName") // populate sender's fullName
      .populate("recipientUserId", "fullName") // populate recipient's fullName
      .select("senderUserId recipientUserId"); // return sender and recipient fields from Message

    // Format result: extract sender, recipient info
    const results = acceptedMessages.map(msg => ({
      senderName: msg.senderUserId.fullName, // sender's full name
      recipientUserId: msg.recipientUserId._id, // recipient's ID
      recipientName: msg.recipientUserId.fullName, // recipient's full name
    }));

    res.json(results);
  } catch (err) {
    console.error("Error fetching accepted users:", err);
    res.status(500).json({ error: "Failed to fetch accepted users" });
  }
});

module.exports = router;
