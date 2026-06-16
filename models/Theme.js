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

const Theme =
  mongoose.models.Theme ||
  mongoose.model("Theme", ThemeSchema);

export default Theme;
