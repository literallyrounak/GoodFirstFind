import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AuthSuccess from "./pages/AuthSuccess";
import Dashboard from "./pages/Dashboard";
import SkillsForm from "./pages/SkillsForm";
import IssueBrowser from "./pages/IssueBrowser";
import QuestList from "./pages/QuestList";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/auth/success" element={<AuthSuccess />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/skills" element={<SkillsForm />} />
        <Route path="/issues" element={<IssueBrowser />} />
        <Route path="/quests" element={<QuestList />} />
        <Route path="/login-failed" element={<p>Login failed. Try again.</p>} />
      </Routes>
    </BrowserRouter>
  );
}
