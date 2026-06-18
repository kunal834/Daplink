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

// it will show error if we not use model.theme every time it will try recreate model if use this only mongoose.model("Theme", ThemeSchema)
export default mongoose.models.Theme || mongoose.model("Theme", ThemeSchema);
