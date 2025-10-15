import mongoose from "mongoose";

const goalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  targetWeight: { type: Number },
  targetCalories: { type: Number, default: 2000 },
  targetProtein: { type: Number, default: 150 },
  targetCarbs: { type: Number, default: 200 },
  targetFats: { type: Number, default: 65 },
  updatedAt: { type: Date, default: Date.now },
});

export const Goal = mongoose.model("Goal", goalSchema);
