const mongoose = require("mongoose");

const QuestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    issueId: { type: String, required: true },
    issueUrl: { type: String, required: true },
    title: { type: String, required: true },
    repoName: { type: String, required: true },
    language: { type: String },
    labels: [{ type: String }],

    status: {
      type: String,
      enum: ["saved", "in_progress", "pr_submitted", "completed"],
      default: "saved",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quest", QuestSchema);