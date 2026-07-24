import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api";

const COMFORT_LEVELS = ["learning", "comfortable", "confident"];

export default function SkillsForm() {
  const [skills, setSkills] = useState([]);
  const [language, setLanguage] = useState("");
  const [comfortLevel, setComfortLevel] = useState("learning");
  const [status, setStatus] = useState(null); // "loading" | "saving" | "saved" | error string

  useEffect(() => {
    apiFetch("/api/users/skills")
      .then(setSkills)
      .catch((err) => setStatus(err.message));
  }, []);

  const addSkill = () => {
    const trimmed = language.trim();
    if (!trimmed) return;
    if (skills.some((s) => s.language.toLowerCase() === trimmed.toLowerCase())) {
      setStatus("That language is already on your list.");
      return;
    }
    setSkills([...skills, { language: trimmed, comfortLevel }]);
    setLanguage("");
    setStatus(null);
  };

  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const saveSkills = async () => {
    setStatus("saving");
    try {
      const updated = await apiFetch("/api/users/skills", {
        method: "PUT",
        body: JSON.stringify({ skills }),
      });
      setSkills(updated);
      setStatus("saved");
    } catch (err) {
      setStatus(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "3rem auto" }}>
      <Link to="/dashboard">&larr; Back to dashboard</Link>
      <h2>Your Skills</h2>
      <p style={{ color: "#666" }}>
        Add the languages you want to focus on, and how comfortable you are with each.
        This drives your issue recommendations — no GitHub auto-detection here, just what you tell us.
      </p>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <input
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addSkill()}
          placeholder="e.g. JavaScript"
          style={{ flex: 1, padding: "0.5rem" }}
        />
        <select value={comfortLevel} onChange={(e) => setComfortLevel(e.target.value)}>
          {COMFORT_LEVELS.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
        <button onClick={addSkill}>Add</button>
      </div>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {skills.map((s, i) => (
          <li
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "0.5rem",
              borderBottom: "1px solid #eee",
            }}
          >
            <span>
              {s.language} — <em>{s.comfortLevel}</em>
            </span>
            <button onClick={() => removeSkill(i)}>Remove</button>
          </li>
        ))}
      </ul>

      <button onClick={saveSkills} style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}>
        Save
      </button>

      {status && status !== "saving" && <p style={{ marginTop: "0.5rem" }}>{status}</p>}
    </div>
  );
}
