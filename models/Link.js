import mongoose from "mongoose";

const LinkItemSchema = new mongoose.Schema(
  {
    link: { type: String, required: true },
    linktext: { type: String, required: true }
  },
  { _id: false }
);

const LinkSchema = new mongoose.Schema(
  {
    // Reference to User
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    // Daplink Handle
    handle: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    name: {
      type: String,
      default: ""
    },
    
    profile: {
      type: String // avatar URL
    },
    script: {
      type: String // bio / description
    },

    // Context
    profession: {
      type: String,
      default: "Creator"
    },
    location: {
      type: String,
      default: "Remote"
    },

    // Page appearance
    theme: {
      type: String,
      default: "classic"
    },

    // Public links
    links: [LinkItemSchema]
  },
  { timestamps: true }
);

export default mongoose.models.Link || mongoose.model("Link", LinkSchema);
