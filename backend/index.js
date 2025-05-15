const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const http = require("http");
const { Server } = require("socket.io");
const MessageModel = require("./models/messageModel");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session Configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions'
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  }
}));

// Passport Initialization
require("./passport");
app.use(passport.initialize());
app.use(passport.session());

// MongoDB Connection
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

// Routes
const getAllUsersRoute = require("./routes/getAll");
const signupRoute = require("./routes/signup");
const loginRoute = require("./routes/login");
const matchingRoute = require("./routes/getMatchUsers");
const getUserRoute = require("./routes/getUser");
const generateSmartRoute = require("./routes/generateSmartMsg");
const pushRequests = require("./routes/pushRequests");
const getRequests = require("./routes/getRequests");
const updateRequests = require("./routes/updateRequests");
const getAcceptedUsers = require("./routes/getAcceptedUsers");
const getMessages = require("./routes/getMessages");
const addCertifications = require("./routes/addCertifications");
const deleteCertifications = require("./routes/deleteCertification");
const editProfile = require("./routes/editProfile");
const googleAuthRoute = require("./routes/googleAuth");

app.use(signupRoute);
app.use(loginRoute);
app.use(getAllUsersRoute);
app.use(matchingRoute);
app.use(getUserRoute);
app.use(generateSmartRoute);
app.use(pushRequests);
app.use(getRequests);
app.use(updateRequests);
app.use(getAcceptedUsers);
app.use(getMessages);
app.use(addCertifications);
app.use(deleteCertifications);
app.use(editProfile);
app.use("/auth", googleAuthRoute);

// Default Route
app.get("/", (req, res) => {
  res.send("Welcome to the Express server!");
});

// Error Handling
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: { message: err.message } });
});

// Setup HTTP server and Socket.IO
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Socket.IO Handlers
// In your server setup
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinUser", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  socket.on("sendMessage", async ({ senderId, recipientId, message }) => {
    console.log("Message received:", { senderId, recipientId, message });
    try {
      const savedMessage = await MessageModel.create({
        sender: senderId,
        recipient: recipientId,
        content: message.text
      });

      // Emit to recipient
      io.to(recipientId).emit("receiveMessage", {
        _id: savedMessage._id,
        sender: senderId,
        recipient: recipientId,
        content: message.text,
        createdAt: savedMessage.createdAt,
        read: false
      });

      // Emit back to sender for confirmation
      io.to(senderId).emit("messageSent", {
        _id: savedMessage._id,
        sender: senderId,
        recipient: recipientId,
        content: message.text,
        createdAt: savedMessage.createdAt,
        read: false
      });

    } catch (error) {
      console.error("Error saving message:", error);
    }
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server and Socket.IO running on port ${PORT}`);
});
