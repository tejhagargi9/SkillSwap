const express = require("express");
const router = express.Router();
require("dotenv").config();

const addOnPrompt = `
You are a skill development assistant. Generate personalized learning recommendations in STRICT JSON FORMAT. Follow these rules:

User Profile:
- Skills: {{learnSkills}}
- Level: {{proficiencyLevel}}

Generate JSON with these structures:
{
  "recommendations": [
    {
      "skill": "Complementary skill name",
      "reason": "Explanation text (30 words)"
    }
  ],
  "roadmap": [
    {
      "skill": "Skill name",
      "weeks": [
        {
          "week": 1,
          "goals": ["Goal 1", "Goal 2"]
        },
        {
          "week": 2,
          "goals": ["Goal 1", "Goal 2"]
        }
      ]
    }
  ],
  "resources": [
    {
      "skill": "Skill name",
      "materials": [
        {
          "type": "YouTube|Article|Book|Course",
          "title": "Resource title",
          "link": "Full URL"
        }
      ]
    }
  ]
}

RULES:
1. Always use double quotes
2. No markdown formatting
3. All root elements must be arrays
4. Maintain consistent property names
5. Never use trailing commas
6. Escape special characters
7. Include at least 3 items in each array

Generate for these skills: {{learnSkills}} at {{proficiencyLevel}} level.`;

router.post("/generateSmart", async (req, res) => {
  const { learnSkills, proficiencyLevel } = req.body; // Get user data from request body
  const { GoogleGenerativeAI } = require("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(process.env.GEN_AI_API_KEY);

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Replace placeholders in the prompt with user data
    const customPrompt = addOnPrompt
      .replace("{{learnSkills}}", learnSkills.join(", "))
      .replace("{{proficiencyLevel}}", proficiencyLevel);

    const result = await model.generateContent(customPrompt);

    // Extract and parse the raw response
    const rawResponse = await result.response.text();

    // Clean the response if it contains markdown code block markers
    let cleanedResponse = rawResponse;
    if (rawResponse.includes("```json")) {
      cleanedResponse = rawResponse.split("```json")[1].split("```")[0].trim();
    }

    // Log the cleaned response for debugging
    console.log("Cleaned Response:", cleanedResponse);

    // Parse the cleaned response into a JSON object
    const recommendations = JSON.parse(cleanedResponse);

    // Send the parsed JSON object as the response
    res.status(200).json(recommendations);
  } catch (error) {
    console.error("Error generating smart recommendations:", error);
    res.status(500).json({
      error: "Failed to generate smart recommendations.",
      details: error.message,
    });
  }
});

module.exports = router;