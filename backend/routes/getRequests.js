const express = require("express");
const router = express.Router();
const MessageModel = require("../models/requestsModel"); // Adjust path as needed
 

router.get("/getRequests", async (req, res) => {
  try {
    const messages = await MessageModel.find()
      .populate("senderUserId", "fullName email") // Only populate necessary fields
      .populate("recipientUserId", "fullName email")
      .sort({ createdAt: -1 }); // Newest first

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Server error while fetching messages" });
  }
});

module.exports = router;
