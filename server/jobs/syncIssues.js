const cron = require("node-cron");
const User = require("../models/User");
const { syncIssues, DEFAULT_LANGUAGES } = require("../services/githubSync");

/**
 * Pulls the distinct set of languages across every user's saved skills.
 * Falls back to DEFAULT_LANGUAGES if no one has added skills yet (e.g. a
 * fresh install with no users, or a dev environment with one test account).
 */
async function getLanguagesToSync() {
  const users = await User.find({ "skills.0": { $exists: true } }).select("skills accessToken");

  const languageSet = new Set();
  for (const user of users) {
    for (const skill of user.skills) {
      languageSet.add(skill.language);
    }
  }

  if (languageSet.size === 0) {
    return { languages: DEFAULT_LANGUAGES, token: users[0]?.accessToken };
  }

  // Use any logged-in user's access token to authenticate the sync —
  // the sync isn't user-specific, we just need a valid token to raise
  // GitHub's rate limit from 60/hr to the authenticated tier.
  const tokenHolder = users.find((u) => u.accessToken);
  return { languages: Array.from(languageSet), token: tokenHolder?.accessToken };
}

/**
 * Schedules the sync job. Runs once immediately on startup (so you're not
 * staring at an empty recommendations list right after deploying), then
 * every 30 minutes after that.
 */
function startSyncJob() {
  const runSync = async () => {
    try {
      const { languages, token } = await getLanguagesToSync();
      if (!token) {
        console.log("Sync skipped: no user with a GitHub access token yet");
        return;
      }
      await syncIssues(languages, token);
    } catch (err) {
      console.error("Sync job failed:", err.message);
    }
  };

  runSync(); // run once on boot
  cron.schedule("*/30 * * * *", runSync); // then every 30 minutes
  console.log("Issue sync job scheduled (every 30 min)");
}

module.exports = startSyncJob;
