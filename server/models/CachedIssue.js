const mongoose = require("mongoose");

const CachedIssueSchema = new mongoose.Schema(
  {
    issueId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    url: { type: String, required: true },
    repoName: { type: String, required: true },
    language: { type: String, required: true, index: true },
    labels: [{ type: String }],
    commentsCount: { type: Number, default: 0 },
    issueCreatedAt: { type: Date },
    lastSyncedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

CachedIssueSchema.index({ language: 1, lastSyncedAt: -1 });

module.exports = mongoose.model("CachedIssue", CachedIssueSchema);