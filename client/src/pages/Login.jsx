import { API_URL } from "../api";

export default function Login() {
  const handleLogin = () => {
    window.location.href = `${API_URL}/api/auth/github`;
  };

  return (
    <div style={{ textAlign: "center", marginTop: "4rem" }}>
      <h1>Quest Board</h1>
      <p>Find beginner-friendly open-source issues, matched to you.</p>
      <button onClick={handleLogin} style={{ padding: "0.75rem 1.5rem", fontSize: "1rem" }}>
        Log in with GitHub
      </button>
    </div>
  );
}
