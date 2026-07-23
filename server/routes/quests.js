const express = require("express");
const requireAuth = require("../middleware/auth");
const Quest = require("../models/Quest");

const router = express.Router();

const VALID_STATUSES = ["saved", "in_progress", "pr_submitted", "completed"];

router.get("/", requireAuth, async (req, res) => {
  try {
    const filter = { user: req.userId };
    if (req.query.status) filter.status = req.query.status;

    const quests = await Quest.find(filter).sort({ createdAt: -1 });
    res.json(quests);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/", requireAuth, async (req, res) => {
  const { issueId, issueUrl, title, repoName, language, labels } = req.body;

  if (!issueId || !issueUrl || !title || !repoName) {
    return res.status(400).json({
      error: "issueId, issueUrl, title, and repoName are required",
    });
  }

  try {
    const existing = await Quest.findOne({ user: req.userId, issueId });
    if (existing) {
      return res.status(409).json({ error: "Already saved as a quest" });
    }

    const quest = await Quest.create({
      user: req.userId,
      issueId,
      issueUrl,
      title,
      repoName,
      language,
      labels,
    });

    res.status(201).json(quest);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.patch("/:id", requireAuth, async (req, res) => {
  const { status } = req.body;

  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      error: `status must be one of: ${VALID_STATUSES.join(", ")}`,
    });
  }

  try {
    const quest = await Quest.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { status },
      { new: true }
    );

    if (!quest) return res.status(404).json({ error: "Quest not found" });
    res.json(quest);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const quest = await Quest.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });
    if (!quest) return res.status(404).json({ error: "Quest not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;