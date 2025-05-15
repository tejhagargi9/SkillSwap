const express = require("express");
const router = express.Router();
const Message = require("../models/requestsModel");

// GET /acceptedUsers - Return full sender & recipient user info for accepted messages
router.get("/acceptedUsers", async (req, res) => {
  try {
    const acceptedMessages = await Message.find({ status: "accepted" })
      .populate("senderUserId")       // populate full sender user object
      .populate("recipientUserId")    // populate full recipient user object
      .select("senderUserId recipientUserId"); // select only these fields from the message

    // Format result: extract sender and recipient full objects
    const results = acceptedMessages.map(msg => ({
      sender: msg.senderUserId,            // full sender user document (includes _id)
      recipient: msg.recipientUserId       // full recipient user document (includes _id)
    }));

    res.json(results);
  } catch (err) {
    console.error("Error fetching accepted users:", err);
    res.status(500).json({ error: "Failed to fetch accepted users" });
  }
});

module.exports = router;
