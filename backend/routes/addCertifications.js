
const express = require('express');
const router = express.Router();
const User = require('../models/userModel');

router.post("/addCertifications", async (req, res) => {
  try {
    const { userId, certification } = req.body;

    // Validate the request
    if (!userId || !certification || !certification.name || !certification.date) {
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

    // Add the certification
    user.certifications.push({
      name: certification.name,
      link: certification.link || "",
      date: certification.date
    });

    // Save the user
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Certification added successfully",
      user: user
    });
  } catch (error) {
    console.error("Error adding certification:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
});

module.exports = router;