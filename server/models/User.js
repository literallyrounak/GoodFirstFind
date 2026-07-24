const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    githubId: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    displayName: { type: String },
    avatarUrl: { type: String },
    profileUrl: { type: String },
    accessToken: { type: String },

    skills: [
      {
        language: { type: String, required: true },
        comfortLevel: {
          type: String,
          enum: ["learning", "comfortable", "confident"],
          default: "learning",
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);