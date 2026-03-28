const User = require("../models/User");
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.body.userId;
    const { age, gender, height, weight } = req.body;
    if (!age || !height || !weight) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    const waterGoal = weight * 35;
    const user = await User.findByIdAndUpdate(
      userId,
      {
        age,
        gender,
        height,
        weight,
        bmi: Math.round(bmi * 10) / 10,
        dailyWaterGoal: waterGoal,
        profileCompleted: true
      },
      { new: true }
    );
    res.json({
      message: "Profile updated successfully",
      user
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Profile update failed" });
  }
};

exports.updateSleep = async (req, res) => {
  try {
    const { userId, sleepHours } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { sleepHours },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Sleep update failed" });
  }
};

exports.updateActivity = async (req, res) => {
  try {
    const { userId, minutes } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { lastActiveMinutes: minutes },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Activity update failed" });
  }
};

exports.updateNudgeSettings = async (req, res) => {
  try {
    const { userId, enabled, mode } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { nudgeSettings: { enabled, mode } },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to update nudge settings" });
  }
};