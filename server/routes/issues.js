const express = require("express");
const axios = require("axios");
const requireAuth = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  const { language, label = "good first issue" } = req.query;

  if (!language) {
    return res.status(400).json({ error: "language query param is required" });
  }

  try {
    const user = await User.findById(req.userId).select("accessToken");
    if (!user?.accessToken) {
      return res.status(401).json({ error: "No GitHub access token on file" });
    }

    const q = `label:"${label}" language:${language} state:open`;

    const response = await axios.get("https://api.github.com/search/issues", {
      params: { q, per_page: 20, sort: "created", order: "desc" },
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
        Accept: "application/vnd.github+json",
      },
    });

    const issues = response.data.items.map((issue) => ({
      id: issue.id,
      title: issue.title,
      url: issue.html_url,
      repoName: issue.repository_url.split("/repos/")[1],
      labels: issue.labels.map((l) => l.name),
      commentsCount: issue.comments,
      createdAt: issue.created_at,
      language,
    }));

    res.json(issues);
  } catch (err) {
    console.error(err.response?.data || err.message);
    const status = err.response?.status === 403 ? 429 : 502;
    res.status(status).json({
      error:
        status === 429
          ? "GitHub rate limit hit — try again in a minute"
          : "Failed to fetch issues from GitHub",
    });
  }
});

module.exports = router;
