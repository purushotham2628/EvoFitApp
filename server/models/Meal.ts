import mongoose from "mongoose";

const mealSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  mealType: { type: String, required: true, enum: ["breakfast", "lunch", "dinner", "snack"] },
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
  carbs: { type: Number, required: true },
  fats: { type: Number, required: true },
  servingSize: { type: String },
  isCustom: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const Meal = mongoose.model("Meal", mealSchema);
