
const express = require('express');
const router = express.Router();
const User = require('../models/userModel');


router.delete("/user/certifications", async (req, res) => {
  try {
    const { userId, certificationId } = req.body;

    // Validate the request
    if (!userId || !certificationId) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields"
      });
    }
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Remove the certification
    user.certifications = user.certifications.filter(
      cert => cert._id.toString() !== certificationId
    );

    // Save the user
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Certification deleted successfully",
      user: user
    });
  } catch (error) {
    console.error("Error deleting certification:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
});


module.exports = router;