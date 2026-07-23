import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthSuccess() {
  const navigate = useNavigate();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("qb_token", token);
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/login-failed", { replace: true });
    }
  }, [navigate]);

  return <p style={{ textAlign: "center", marginTop: "4rem" }}>Logging you in...</p>;
}
