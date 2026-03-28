const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");
require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());
const authRoutes = require("./routes/authRoutes");

app.get("/", (req, res) => {
  res.json({
    message: "AERO Backend API is running",
    endpoints: {
      
      AUTH: {
        "POST /auth/google": "Google Login"
      },

      USER: {
        "POST /user/profile": "Update profile",
        "POST /user/nudge-settings": "Update nudge settings",
        "POST /user/sleep": "Update sleep data",
        "POST /user/activity": "Update activity",
        "POST /user/track-water": "Track water intake"
      },

      ANALYTICS: {
        "GET /user/health-score/:userId": "Get health score",
        "GET /user/prediction/:userId": "Get risk prediction",
        "GET /user/challenge": "Get daily challenge"
      },

      AI: {
        "GET /user/daily-insight/:userId": "AI daily insight",
        "GET /user/summary/:userId": "AI summary",
        "POST /user/chat": "Chat with AERO"
      },

      GAMIFICATION: {
        "GET /user/leaderboard": "Top users"
      },

      DASHBOARD: {
        "GET /user/widget/:userId": "Widget data"
      },

      ML: {
        "POST /user/ml-prediction": "Update ML predictions"
      }
    }
  });
});


app.use("/auth", authRoutes);
app.use("/user", userRoutes);
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));
app.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.PORT}`);
});