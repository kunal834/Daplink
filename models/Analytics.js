import mongoose from "mongoose";

const AnalyticsSchema = new mongoose.Schema(
  {
    linkId: { type: mongoose.Schema.Types.ObjectId, ref: "Link", required: true },
    ip: String,
    referer: String,
    device: String,
    browser: String,
    os: String,
    country: String,
  },
  { timestamps: true }
);

export default mongoose.models.Analytics || mongoose.model("Analytics", AnalyticsSchema);
