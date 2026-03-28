const challenges = [
  {
    id: 1,
    text: "Drink 200ml water right now ",
    xpReward: 20,
    type: "hydration",
    timeLimit: 120,
  },
  {
    id: 2,
    text: "Stand up and stretch for 1 min ",
    xpReward: 15,
    type: "activity",
    timeLimit: 90,
  },
  {
    id: 3,
    text: "Take 10 deep breaths ",
    xpReward: 10,
    type: "wellness",
    timeLimit: 60,
  },
  {
    id: 4,
    text: "Walk to get a glass of water ",
    xpReward: 25,
    type: "activity",
    timeLimit: 180,
  },
  {
    id: 5,
    text: "Drink 100ml and water your forest ",
    xpReward: 15,
    type: "hydration",
    timeLimit: 60,
  },
];

const generateChallenge = () => {
  const random = challenges[Math.floor(Math.random() * challenges.length)];
  return {
    ...random,
    expiresAt: new Date(Date.now() + random.timeLimit * 1000),
  };
};

module.exports = { generateChallenge };