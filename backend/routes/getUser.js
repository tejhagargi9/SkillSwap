const express = require('express');
const router = express.Router();
const User = require('../models/userModel'); // Adjust path to your User model

// Get user details by userId (using query params)
router.get('/getUser', async (req, res) => {
  const { userId } = req.query; // Correct for GET requests
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
