require("dotenv").config();
const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = "llama-3.1-8b-instant";


const clean = (text) => {
  if (!text) return null;
  return text.replace(/^"+|"+$/g, "").trim();
};


const generateNudgeAI = async ({ type, mode, waterIntake, goal, inactivity }) => {
  try {
    const prompt = `You are AERO, a friendly nature-themed health companion.

Situation: ${type}
Mode: ${mode}
Water: ${waterIntake}/${goal}ml
Inactivity: ${inactivity} mins

Generate ONE short nudge (max 15 words). Use nature/forest references.
Tone: gentle=calm, motivational=energetic, intense=urgent but friendly.`;

    const res = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: MODEL,
    });

    return clean(res.choices?.[0]?.message?.content);
  } catch {
    return null;
  }
};


const generateDailyInsight = async (user) => {
  try {
    const prompt = `You are AERO, a nature-themed health AI.

User stats today:
- Water: ${user.dailyWaterIntake}/${user.dailyWaterGoal}ml
- Sleep: ${user.sleepHours || "unknown"} hours
- Activity: ${user.lastActiveMinutes || 0} mins inactive
- Streak: ${user.streak} days

Give ONE personalized insight (2-3 sentences). Reference their forest/nature journey. Be encouraging but honest.`;

    const res = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: MODEL,
    });

    return clean(res.choices?.[0]?.message?.content);
  } catch {
    return "Keep nurturing your forest — every sip of water makes it grow stronger 🌿";
  }
};


const generateSummary = async (user) => {
  try {
    const percent = Math.round((user.dailyWaterIntake / user.dailyWaterGoal) * 100);

    const prompt = `You are AERO, a nature-themed health AI.

End of day summary for user:
- Water goal: ${percent}% completed
- Sleep: ${user.sleepHours || "unknown"} hours
- Streak: ${user.streak} days
- XP earned today: ${user.xp}
- Jug mood: ${user.jugMood || "neutral"}

Write a short encouraging summary (2-3 sentences). Use forest/nature theme. Reference their jug/forest progress.`;

    const res = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: MODEL,
    });

    return clean(res.choices?.[0]?.message?.content);
  } catch {
    return "Great effort today! Your forest is slowly growing. Keep the streak alive 🌱";
  }
};


const chatWithAERO = async (userMessage, user) => {
  try {
    const systemPrompt = `You are AERO, a gamified nature-themed health companion inside a hydration app.

Current user context:
- Name: ${user.name}
- Water today: ${user.dailyWaterIntake}/${user.dailyWaterGoal}ml
- Streak: ${user.streak} days
- Level: ${user.level}
- XP: ${user.xp}
- Sleep: ${user.sleepHours || "unknown"} hours
- Jug mood: ${user.jugMood || "neutral"}
- Health score: ${user.healthScore || "unknown"}

You are friendly, nature-themed, gamified. Keep responses short (max 3 sentences).
Reference their actual stats when relevant. Use forest/nature metaphors.
If they ask about water, remind them of their goal. Encourage streaks.`;

    const res = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      model: MODEL,
    });

    return clean(res.choices?.[0]?.message?.content);
  } catch {
    return "I'm having trouble connecting right now. But remember — your forest needs water! 🌿";
  }
};

module.exports = {
  generateNudgeAI,
  generateDailyInsight,
  generateSummary,
  chatWithAERO,
};