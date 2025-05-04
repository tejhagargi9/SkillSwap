const express = require("express");
const router = express.Router();
const MessageModel = require("../models/requestsModel");

router.post("/sendConnectionRequest", async (req, res) => {
  try {
    const { senderUserId, recipientUserId } = req.body;
    console.log("Sender ID: ", senderUserId);
    console.log("Recipient ID: ", recipientUserId);
    console.log("Connection request details: ", req.body);

    // Create new connection request
    const newConnectionRequest = new MessageModel({
      senderUserId,
      recipientUserId
    });
    
    // Save to database
    await newConnectionRequest.save();
    
    res.status(201).json({ 
      message: "Connection request sent successfully"
    });

  } catch (error) {
    console.error("Connection request error:", error);
    res.status(500).json({ 
      error: "Internal server error", 
      message: error.message 
    });
  }
});

module.exports = router;