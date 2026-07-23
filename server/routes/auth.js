const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const requireAuth = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

// Step 1: Kick off GitHub OAuth
router.get(
  "/github",
  passport.authenticate("github", { session: false, scope: ["read:user"] })
);

// Step 2: GitHub redirects back here
router.get(
  "/github/callback",
  passport.authenticate("github", { session: false, failureRedirect: "/login-failed" }),
  (req, res) => {
    // req.user was set by the passport strategy's `done(null, user)` call
    const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Redirect back to the frontend with the token.
    // Frontend should read this from the URL and store it (e.g. in memory or a cookie).
    res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`);
  }
);

// Step 3: Frontend calls this with the JWT to get the logged-in user's info
router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-accessToken");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
