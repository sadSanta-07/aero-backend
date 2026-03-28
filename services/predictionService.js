const predictRisk = (user) => {
  const now = new Date();
  const hour = now.getHours();

  const expectedByNow = (hour / 24) * user.dailyWaterGoal;
  const actualPercent = user.dailyWaterIntake / user.dailyWaterGoal;

  let risk = "low";
  let message = "You're on track today ";
  let treeHealth = "growing"; 

  if (user.dailyWaterIntake < expectedByNow * 0.5) {
    risk = "high";
    message = "You might miss your hydration goal today. Your forest is drying up!";
    treeHealth = "wilting";
  } else if (user.dailyWaterIntake < expectedByNow * 0.75) {
    risk = "medium";
    message = "You're a bit behind. Give your forest some water 💧";
    treeHealth = "slow";
  }

  if (user.sleepHours && user.sleepHours < 5) {
    risk = risk === "low" ? "medium" : risk;
    message += " Low sleep is affecting your energy too.";
  }

  const today = new Date().toDateString();
  const streakAtRisk =
    user.streak > 0 && user.lastActiveDate !== today && hour > 18;

  return {
    risk,
    message,
    treeHealth,
    streakAtRisk,
    streakMessage: streakAtRisk
      ? `Your ${user.streak}-day streak is at risk! Act now.`
      : null,
  };
};

module.exports = { predictRisk };