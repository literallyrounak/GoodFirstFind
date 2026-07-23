const express = require("express");
const requireAuth = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

// Get current user's skills
router.get("/skills", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("skills");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user.skills);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Replace the full skills array (simplest approach for v1 —
// frontend sends the complete updated list on every save)
router.put("/skills", requireAuth, async (req, res) => {
  const { skills } = req.body; // [{ language, comfortLevel }]

  if (!Array.isArray(skills)) {
    return res.status(400).json({ error: "skills must be an array" });
  }

  const validLevels = ["learning", "comfortable", "confident"];
  const isValid = skills.every(
    (s) => s.language && validLevels.includes(s.comfortLevel)
  );
  if (!isValid) {
    return res.status(400).json({
      error: "Each skill needs a language and a valid comfortLevel",
    });
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.userId,
      { skills },
      { new: true, runValidators: true }
    ).select("skills");

    res.json(user.skills);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
