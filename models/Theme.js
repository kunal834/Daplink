// models/Theme.js
import mongoose from "mongoose";

const ThemeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  isPremium: { type: Boolean, default: false },

  tokens: {
    background: String,
    cardBg: String,
    textColor: String,
    buttonBg: String,
    buttonText: String,
    radius: Number,
    font: String
  },

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Theme", ThemeSchema);
