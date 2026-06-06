import mongoose from "mongoose";

const RedirectRuleSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['device', 'time', 'location'], required: true },
    condition: { type: String, required: true }, // e.g. 'iOS', '09:00-17:00', 'US'
    targetUrl: { type: String, required: true }
  },
  { _id: false }
);

const ShortLinkSchema = new mongoose.Schema(
  {
    title: { type: String, default: 'Untitled' },
    shortCode: { type: String, required: true, unique: true },
    originalUrl: { type: String, required: true },
    clicks: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isActive: { type: Boolean, default: true },
    rules: { type: [RedirectRuleSchema], default: [] }
  },
  { timestamps: true }
);

const ShortURL=mongoose.models.ShortLink || mongoose.model("ShortLink", ShortLinkSchema);
export default ShortURL;
