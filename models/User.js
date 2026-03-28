const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    name: String,
    email: { type: String, unique: true },
    avatar: String,
    googleId: String,
    password: String, // for email/password auth

    profileCompleted: { type: Boolean, default: false },
    age: Number,
    gender: String,
    height: Number,
    weight: Number,
    bmi: Number,

    dailyWaterGoal: { type: Number, default: 2500 },
    dailyWaterIntake: { type: Number, default: 0 },
    lastWaterLogDate: String,

    sleepHours: { type: Number, default: 7 },
    lastActiveMinutes: { type: Number, default: 0 },

    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    streak: { type: Number, default: 0 },
    lastActiveDate: String,
    streakInsuranceUsed: { type: Boolean, default: false },

    achievements: { type: [String], default: [] },

    nudgeSettings: {
        enabled: { type: Boolean, default: true },
        mode: { type: String, default: "motivational" },
    },
    mlPrediction: {
        hydrationRisk: String,
        stressLevel: Number,
        predictedIntake: Number,
        updatedAt: Date
    }
});

module.exports = mongoose.model("User", userSchema);