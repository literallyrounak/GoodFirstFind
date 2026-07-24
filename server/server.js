require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("./config/passport");

const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const issuesRoutes = require("./routes/issues");
const questsRoutes = require("./routes/quests");
const recommendationsRoutes = require("./routes/recommendations");
const startSyncJob = require("./jobs/syncIssues");

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(passport.initialize());

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/issues", issuesRoutes);
app.use("/api/quests", questsRoutes);
app.use("/api/recommendations", recommendationsRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    startSyncJob();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });