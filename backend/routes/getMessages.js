// routes/messages.js
const express = require('express');
const router = express.Router();
const Message = require('../models/messageModel');

// GET messages between two users
// routes/messages.js
router.get('/:userId', async (req, res) => {
  try {
    const currentUserId = req.query.senderId;
    const otherUserId = req.params.userId;

    if (!currentUserId || !otherUserId) {
      return res.status(400).json({ error: 'Missing senderId or recipientId in backend while fetching messages' });
    }

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, recipient: otherUserId },
        { sender: otherUserId, recipient: currentUserId }
      ]
    })
    .sort({ createdAt: 1 })
    .exec();

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;