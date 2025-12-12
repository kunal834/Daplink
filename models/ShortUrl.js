import mongoose from "mongoose";

const ShortLinkSchema = new mongoose.Schema(
  {
    shortCode: { type: String, required: true, unique: true },
    originalUrl: { type: String, required: true },
    clicks: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const ShortURL=mongoose.models.ShortLink || mongoose.model("ShortLink", ShortLinkSchema);
export default ShortURL;
