const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { updateProfile, updateNudgeSettings, updateSleep, updateActivity } = require("../controllers/userController");
const { trackWater } = require("../controllers/waterController");
const { calculateHealthScore } = require("../services/healthService");
const { predictRisk } = require("../services/predictionService");
const { generateChallenge } = require("../services/challengeService");
const { generateDailyInsight, generateSummary, chatWithAERO } = require("../services/aiService");
router.post("/profile", updateProfile);
router.post("/nudge-settings", updateNudgeSettings);
router.post("/sleep", updateSleep);
router.post("/activity", updateActivity);

router.post("/track-water", trackWater);
router.get("/health-score/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const score = calculateHealthScore(user);
    res.json(score);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/prediction/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const prediction = predictRisk(user);
    res.json(prediction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/challenge", (req, res) => {
  const challenge = generateChallenge();
  res.json(challenge);
});

router.get("/daily-insight/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const insight = await generateDailyInsight(user);
    res.json({ insight });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/summary/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const summary = await generateSummary(user);
    res.json({ summary });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.post("/chat", async (req, res) => {
  try {
    const { userId, message } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ error: "userId and message required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    const scoreData = calculateHealthScore(user);
    user.jugMood = scoreData.jugMood;
    user.healthScore = scoreData.totalScore;

    const reply = await chatWithAERO(message, user);
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/leaderboard", async (req, res) => {
  try {
    const users = await User.find({}, "name xp level streak avatar")
      .sort({ xp: -1 })
      .limit(20);

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/widget/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const score = calculateHealthScore(user);
    const prediction = predictRisk(user);

    res.json({
      name: user.name,
      waterIntake: user.dailyWaterIntake,
      waterGoal: user.dailyWaterGoal,
      waterPercent: Math.round((user.dailyWaterIntake / user.dailyWaterGoal) * 100),
      streak: user.streak,
      xp: user.xp,
      level: user.level,
      jugMood: score.jugMood,
      healthScore: score.totalScore,
      streakAtRisk: prediction.streakAtRisk,
      treeHealth: prediction.treeHealth,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.post("/ml-prediction", async (req, res) => {
  try {
    const { userId, hydrationRisk, stressLevel, predictedIntake } = req.body;
    
    const user = await User.findByIdAndUpdate(
      userId,
      { 
        mlPrediction: {
          hydrationRisk,    
          stressLevel,        
          predictedIntake,   
          updatedAt: new Date()
        }
      },
      { new: true }
    );
    
    res.json({ success: true, prediction: user.mlPrediction });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;