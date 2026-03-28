const User = require("../models/User");

exports.trackWater = async (req, res) => {
  try {
    const { userId, amount } = req.body;

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ error: "User not found" });

    const today = new Date().toDateString();


    if (user.lastWaterLogDate !== today) {
      user.dailyWaterIntake = 0;
      user.lastWaterLogDate = today;
    }
    user.dailyWaterIntake += amount;
    user.xp += Math.floor(amount / 100); // 100ml = 1 XP
    user.level = Math.floor(user.xp / 100) + 1;
    if (user.lastActiveDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (user.lastActiveDate === yesterday.toDateString()) {
        user.streak += 1;
      } else {
        user.streak = 1;
      }

      user.lastActiveDate = today;
    }

    await user.save();

    res.json({
      water: user.dailyWaterIntake,
      xp: user.xp,
      level: user.level,
      streak: user.streak
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Water tracking failed" });
  }
};