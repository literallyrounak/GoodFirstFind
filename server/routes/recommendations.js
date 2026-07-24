const express = require("express");
const requireAuth = require("../middleware/auth");
const User = require("../models/User");
const CachedIssue = require("../models/CachedIssue");
const { rankIssues } = require("../services/matchScore");

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("skills");

    if (!user.skills || user.skills.length === 0) {
      return res.json({
        message: "Add some skills to get personalized recommendations.",
        recommendations: [],
      });
    }

    const languages = user.skills.map((s) => s.language);

    // Only pull cached issues in languages the user actually cares about —
    // no point scoring issues we'd filter out anyway.
    const candidateIssues = await CachedIssue.find({
      language: { $in: languages.map((l) => new RegExp(`^${l}$`, "i")) },
    })
      .sort({ lastSyncedAt: -1 })
      .limit(200); // cap how much we score per request

    const ranked = rankIssues(user.skills, candidateIssues, 20);

    const recommendations = ranked.map(({ issue, score }) => ({
      id: issue.issueId,
      title: issue.title,
      url: issue.url,
      repoName: issue.repoName,
      language: issue.language,
      labels: issue.labels,
      commentsCount: issue.commentsCount,
      matchScore: score,
    }));

    res.json({ message: null, recommendations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
