const express = require("express");
const router = express.Router();
const multer = require("multer");
const User = require("../models/userModel");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';
    // Ensure the uploads directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Route to update user profile
router.put("/updateProfile", upload.single('profileImage'), async (req, res) => {
  try {
    const { userId, fullName, email } = req.body;
    
    // Parse skills arrays from JSON strings
    const teachSkills = JSON.parse(req.body.teachSkills || '[]');
    const learnSkills = JSON.parse(req.body.learnSkills || '[]');

    if (!Array.isArray(teachSkills) || !teachSkills.every(item => typeof item === 'object' && item.skill)) {
  return res.status(400).json({ success: false, message: "Invalid teachSkills format" });
}


    // Find the user
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Update user fields
    user.fullName = fullName;
    user.email = email;
    user.teachSkills = teachSkills;
    user.learnSkills = learnSkills;

    // Handle profile image upload if provided
    if (req.file) {
      try {
        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "user_profiles",
          width: 500,
          crop: "limit"
        });

        // Update user profile image URL
        user.image = result.secure_url;

        // Delete the local file after upload
        fs.unlinkSync(req.file.path);
      } catch (uploadError) {
        console.error("Error uploading to Cloudinary:", uploadError);
        return res.status(500).json({ success: false, message: "Error uploading image" });
      }
    }

    // Save the updated user
    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: error.message
    });
  }
});

module.exports = router;