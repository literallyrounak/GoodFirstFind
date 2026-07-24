const axios = require("axios");
const CachedIssue = require("../models/CachedIssue");

const DEFAULT_LANGUAGES = ["JavaScript", "Python", "TypeScript", "Java", "Go"];

const LABELS_TO_SYNC = ["good first issue", "help wanted"];

async function fetchIssuesForLanguage(language, token) {
  const results = [];

  for (const label of LABELS_TO_SYNC) {
    const q = `label:"${label}" language:${language} state:open`;

    try {
      const response = await axios.get("https://api.github.com/search/issues", {
        params: { q, per_page: 30, sort: "created", order: "desc" },
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
        },
      });

      results.push(...response.data.items);
    } catch (err) {
      console.error(
        `Sync failed for ${language}/${label}:`,
        err.response?.data?.message || err.message
      );
    }

    await new Promise((resolve) => setTimeout(resolve, 2100));
  }

  return results;
}

async function upsertIssues(rawIssues, language) {
  let upserted = 0;

  for (const issue of rawIssues) {
    try {
      await CachedIssue.findOneAndUpdate(
        { issueId: String(issue.id) },
        {
          issueId: String(issue.id),
          title: issue.title,
          url: issue.html_url,
          repoName: issue.repository_url.split("/repos/")[1],
          language,
          labels: issue.labels.map((l) => l.name),
          commentsCount: issue.comments,
          issueCreatedAt: issue.created_at,
          lastSyncedAt: new Date(),
        },
        { upsert: true, new: true }
      );
      upserted += 1;
    } catch (err) {
      console.error(`Failed to upsert issue ${issue.id}:`, err.message);
    }
  }

  return upserted;
}

async function syncIssues(languages = DEFAULT_LANGUAGES, token) {
  if (!token) {
    console.error("syncIssues: no GitHub token provided, skipping sync");
    return;
  }

  console.log(`Starting issue sync for languages: ${languages.join(", ")}`);
  let totalUpserted = 0;

  for (const language of languages) {
    const rawIssues = await fetchIssuesForLanguage(language, token);
    const upserted = await upsertIssues(rawIssues, language);
    totalUpserted += upserted;
    console.log(`  ${language}: ${upserted} issues synced`);
  }

  console.log(`Sync complete. ${totalUpserted} issues upserted total.`);
}

module.exports = { syncIssues, DEFAULT_LANGUAGES };
