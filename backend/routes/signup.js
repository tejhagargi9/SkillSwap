const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

router.post("/signup", async (req, res) => {  
  const { fullName, email, password, teachSkills, learnSkills } = req.body;
  console.log("Signp Details : ",req.body);

  try {
    // Simple validation
    if (!fullName || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please enter all required fields" });
    }

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Process teachSkills array
    const formattedTeachSkills = teachSkills
      .filter((skillObj) => skillObj.skill && skillObj.skill.trim())
      .map((skillObj) => ({
        skill: skillObj.skill.trim(), 
        tag: skillObj.tag ? skillObj.tag.trim() : "Other",
        proficiency: skillObj.proficiency || "Intermediate",
      }));

    // Process learnSkills array
    const formattedLearnSkills = learnSkills
      .filter((skill) => skill && skill.trim())
      .map((skill) => skill.trim());

    // Create new user
    const newUser = new User({
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
      teachSkills: formattedTeachSkills,
      learnSkills: formattedLearnSkills,
      createdAt: Date.now(),
    });

    // Save user
    const savedUser = await newUser.save();

    // Return user data without password
    const userToReturn = {
      _id: savedUser._id,
      fullName: savedUser.fullName,
      email: savedUser.email,
      teachSkills: savedUser.teachSkills,
      learnSkills: savedUser.learnSkills,
      createdAt: savedUser.createdAt,
    };

    res.status(201).json(userToReturn);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during registration" });
  }
});

module.exports = router;
