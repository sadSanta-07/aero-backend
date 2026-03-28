const { generateNudgeAI } = require("./aiService");

const generateNudge = async (user, progress) => {

  if (!user.nudgeSettings || !user.nudgeSettings.enabled) return null;

  const mode = user.nudgeSettings.mode;

  const { waterIntake, lastActiveMinutes } = progress;

  if (waterIntake < user.dailyWaterGoal * 0.5) {

    const aiMessage = await generateNudgeAI({
      type: "hydration",
      mode,
      waterIntake,
      goal: user.dailyWaterGoal,
      inactivity: lastActiveMinutes
    });

    return aiMessage || "Stay hydrated";
  }

  if (lastActiveMinutes > 60) {

    const aiMessage = await generateNudgeAI({
      type: "inactivity",
      mode,
      waterIntake,
      goal: user.dailyWaterGoal,
      inactivity: lastActiveMinutes
    });

    return aiMessage || "Time to move";
  }

  return null;
};

module.exports = { generateNudge };