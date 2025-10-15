import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  exerciseName: { type: String, required: true },
  sets: { type: Number, required: true },
  reps: { type: Number, required: true },
  weight: { type: Number },
  duration: { type: Number },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const Workout = mongoose.model("Workout", workoutSchema);
