import mongoose from "mongoose";

const LinkSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, // optional but recommended
    handle: { type: String, required: true, unique: true },
    url: { type: String, required: true },
    title: { type: String },
    description: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Link || mongoose.model("Link", LinkSchema);
