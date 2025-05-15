// routes/requests.js or wherever your routes are
const express = require("express");
const router = express.Router();
const RequestModel = require("../models/requestsModel");

// Accept a request by ID
router.post("/acceptRequest/:id", async (req, res) => {
  try {
    const requestId = req.params.id;
    const updatedRequest = await RequestModel.findByIdAndUpdate(
      requestId,
      { status: "accepted" },
      { new: true }
    );
    if (!updatedRequest) {
      return res.status(404).json({ message: "Request not found" });
    }
    res.status(200).json(updatedRequest);
  } catch (error) {
    console.error("Error accepting request:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
