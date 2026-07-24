import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api";
import IssueCard from "./IssueCard";

export default function RecommendationsSection() {
  const [recommendations, setRecommendations] = useState([]);
  const [message, setMessage] = useState(null);
  const [savedIds, setSavedIds] = useState(new Set());
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    apiFetch("/api/recommendations")
      .then((data) => {
        setRecommendations(data.recommendations);
        setMessage(data.message);
        setStatus(null);
      })
      .catch((err) => setStatus(err.message));
  }, []);

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
    <div style={{ marginTop: "2.5rem", textAlign: "left" }}>
      <h3>Recommended for You</h3>

      {status === "loading" && <p style={{ color: "#888" }}>Loading recommendations...</p>}
      {status && status !== "loading" && <p style={{ color: "crimson" }}>{status}</p>}

      {message && (
        <p style={{ color: "#888" }}>
          {message} <Link to="/skills">Go to Skills</Link>
        </p>
      )}

      {!status && !message && recommendations.length === 0 && (
        <p style={{ color: "#888" }}>
          No matches yet — issues for your languages haven't synced yet. Check back in a bit,
          or try <Link to="/issues">Browse Issues</Link> in the meantime.
        </p>
      )}

      {recommendations.map((issue) => (
        <IssueCard
          key={issue.id}
          issue={issue}
          onSave={saveAsQuest}
          saved={savedIds.has(issue.id)}
        />
      ))}
    </div>
  );
}
