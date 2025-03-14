const express = require('express');
const router = express.Router();
const User = require('../models/userModel');

// Route to find matching users
// Route to find matching users
router.post('/getMatchedUsers', async (req, res) => {
  const { userId, teachSkill, teachProficiency, learnSkill } = req.body;
  console.log("Matching details : ", req.body);

  try {
    // Validate input
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Find the requesting user to ensure they exist
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Build the matching query
    let matchQuery = { _id: { $ne: userId } }; // Exclude the current user

    if (teachSkill || learnSkill) {
      matchQuery = {
        ...matchQuery,
        $or: [
          { 'learnSkills': teachSkill }, // Users who want to learn the skill the current user can teach
          { 'teachSkills.skill': learnSkill }, // Users who can teach the skill the current user wants to learn
          { 'teachSkills.tag': learnSkill } // Users whose teachSkills tag matches the user's learnSkill
        ]
      };

      if (teachProficiency && teachProficiency !== 'any') {
        matchQuery['teachSkills'] = {
          $elemMatch: {
            skill: learnSkill,
            proficiency: teachProficiency
          }
        };
      }
    } else {
      return res.status(400).json({ message: 'At least one skill criterion is required' });
    }

    // Find matching users
    const matches = await User.find(matchQuery)
      .select('-password') // Exclude password field
      .limit(20); // Limit results

    res.status(200).json({
      count: matches.length,
      matches
    });

  } catch (err) {
    console.error('Error finding matches:', err);
    res.status(500).json({ message: 'Server error while finding matches' });
  }
});

module.exports = router;
