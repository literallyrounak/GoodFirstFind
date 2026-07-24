import { useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api";
import IssueCard from "../components/IssueCard";

const LABEL_OPTIONS = ["good first issue", "help wanted", "beginner friendly"];

export default function IssueBrowser() {
  const [language, setLanguage] = useState("JavaScript");
  const [label, setLabel] = useState(LABEL_OPTIONS[0]);
  const [issues, setIssues] = useState([]);
  const [savedIds, setSavedIds] = useState(new Set());
  const [status, setStatus] = useState(null);

  const search = async () => {
    setStatus("loading");
    try {
      const params = new URLSearchParams({ language, label });
      const results = await apiFetch(`/api/issues?${params.toString()}`);
      setIssues(results);
      setStatus(null);
    } catch (err) {
      setStatus(err.message);
    }
  };

  const saveAsQuest = async (issue) => {
    try {
      await apiFetch("/api/quests", {
        method: "POST",
        body: JSON.stringify({
          issueId: String(issue.id),
          issueUrl: issue.url,
          title: issue.title,
          repoName: issue.repoName,
          language: issue.language,
          labels: issue.labels,
        }),
      });
      setSavedIds((prev) => new Set(prev).add(issue.id));
    } catch (err) {
      if (err.message.includes("Already saved")) {
        setSavedIds((prev) => new Set(prev).add(issue.id));
      } else {
        alert(err.message);
      }
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "3rem auto" }}>
      <Link to="/dashboard">&larr; Back to dashboard</Link>
      <h2>Browse Issues</h2>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <input
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          placeholder="Language (e.g. JavaScript)"
          style={{ flex: 1, padding: "0.5rem" }}
        />
        <select value={label} onChange={(e) => setLabel(e.target.value)}>
          {LABEL_OPTIONS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
        <button onClick={search}>Search</button>
      </div>

      {status === "loading" && <p>Searching GitHub...</p>}
      {status && status !== "loading" && <p style={{ color: "crimson" }}>{status}</p>}

      {issues.map((issue) => (
        <IssueCard
          key={issue.id}
          issue={issue}
          onSave={saveAsQuest}
          saved={savedIds.has(issue.id)}
        />
      ))}

      {!status && issues.length === 0 && (
        <p style={{ color: "#888" }}>Search for a language to see open issues.</p>
      )}
    </div>
  );
}
