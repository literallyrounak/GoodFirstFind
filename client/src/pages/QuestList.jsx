import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api";

const STATUSES = ["saved", "in_progress", "pr_submitted", "completed"];
const STATUS_LABELS = {
  saved: "Saved",
  in_progress: "In Progress",
  pr_submitted: "PR Submitted",
  completed: "Completed",
};

export default function QuestList() {
  const [quests, setQuests] = useState([]);
  const [error, setError] = useState(null);

  const loadQuests = () => {
    apiFetch("/api/quests")
      .then(setQuests)
      .catch((err) => setError(err.message));
  };

  useEffect(loadQuests, []);

  const updateStatus = async (id, status) => {
    try {
      const updated = await apiFetch(`/api/quests/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setQuests((prev) => prev.map((q) => (q._id === id ? updated : q)));
    } catch (err) {
      alert(err.message);
    }
  };

  const removeQuest = async (id) => {
    try {
      await apiFetch(`/api/quests/${id}`, { method: "DELETE" });
      setQuests((prev) => prev.filter((q) => q._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  if (error) return <p style={{ textAlign: "center", marginTop: "4rem" }}>{error}</p>;

  return (
    <div style={{ maxWidth: 600, margin: "3rem auto" }}>
      <Link to="/dashboard">&larr; Back to dashboard</Link>
      <h2>My Quests</h2>

      {quests.length === 0 && (
        <p style={{ color: "#888" }}>
          No quests yet — go to Browse Issues and save one to get started.
        </p>
      )}

      {quests.map((quest) => (
        <div
          key={quest._id}
          style={{
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: "1rem",
            marginBottom: "0.75rem",
          }}
        >
          <a href={quest.issueUrl} target="_blank" rel="noreferrer">
            <strong>{quest.title}</strong>
          </a>
          <p style={{ margin: "0.25rem 0", color: "#666" }}>{quest.repoName}</p>

          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <select
              value={quest.status}
              onChange={(e) => updateStatus(quest._id, e.target.value)}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
            <button onClick={() => removeQuest(quest._id)}>Remove</button>
          </div>
        </div>
      ))}
    </div>
  );
}
