const calculateHealthScore = (user) => {
  const waterScore = user.dailyWaterGoal
    ? Math.min((user.dailyWaterIntake / user.dailyWaterGoal) * 100, 100)
    : 0;

  const sleepScore = user.sleepHours
    ? Math.min((user.sleepHours / 8) * 100, 100)
    : 50;

  const activityScore = user.lastActiveMinutes < 60 ? 100 : 50;

  const totalScore = Math.round((waterScore + sleepScore + activityScore) / 3);
  let jugMood;
  if (totalScore >= 80) jugMood = "thriving";
  else if (totalScore >= 60) jugMood = "happy";
  else if (totalScore >= 40) jugMood = "neutral";
  else if (totalScore >= 20) jugMood = "tired";
  else jugMood = "dead";

  return {
    waterScore: Math.round(waterScore),
    sleepScore: Math.round(sleepScore),
    activityScore,
    totalScore,
    jugMood,
  };
};

module.exports = { calculateHealthScore };