const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173', 
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI is not set in .env file");
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Import routes
const getAllUsersRoute = require("./routes/getAll")
const signupRoute = require("./routes/signup");
const loginRoute = require("./routes/login");
const matchingRoute = require("./routes/getMatchUsers");
const getUserRoute = require("./routes/getUser");
const generateSmartRoute = require("./routes/generateSmartMsg");


// User routes
app.use(signupRoute);
app.use(loginRoute);
app.use(getAllUsersRoute);
app.use(matchingRoute);
app.use(getUserRoute);
app.use(generateSmartRoute);

// Basic Route
app.get("/", (req, res) => {
  res.send("Welcome to the Express server!");
});

// Error Handling Middleware
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message,
    },
  });
});

// Server Setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
