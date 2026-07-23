import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiFetch("/api/auth/me")
      .then(setUser)
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p style={{ textAlign: "center", marginTop: "4rem" }}>{error}</p>;
  if (!user) return <p style={{ textAlign: "center", marginTop: "4rem" }}>Loading...</p>;

  return (
    <div style={{ maxWidth: 500, margin: "4rem auto", textAlign: "center" }}>
      <img src={user.avatarUrl} alt={user.username} style={{ borderRadius: "50%", width: 80 }} />
      <h2>Welcome, {user.displayName || user.username}</h2>
      <p>GitHub: @{user.username}</p>

      <nav style={{ display: "flex", justifyContent: "center", gap: "1.5rem", marginTop: "2rem" }}>
        <Link to="/skills">Edit Skills</Link>
        <Link to="/issues">Browse Issues</Link>
        <Link to="/quests">My Quests</Link>
      </nav>
    </div>
  );
}
