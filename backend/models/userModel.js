const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Please add a name"],
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  googleId: String,
  password: {
    type: String,
  },
  bio: {
    type: String,
    trim: true,
  },
  certifications: [
    {
      name: {
        type: String,
        required: true,
      },
      link: {
        type: String,
      },
      date: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  image: {
    type: String,
    default:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png",
  },
  teachSkills: [
    {
      skill: { type: String, required: true },
      tag: { type: String },
      proficiency: {
        type: String,
        enum: ["Beginner", "Intermediate", "Advanced"], // optional
      },
    },
  ],

  learnSkills: {
    type: [String],
    default: [],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  matches: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
