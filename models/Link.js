import mongoose from "mongoose";

const LinkItemSchema = new mongoose.Schema(
  {
    link: { type: String, required: true },
    linktext: { type: String, required: true }
  },
  { _id: false }
);

const ThemeConfigSchema = new mongoose.Schema(
  {
    accent: { type: String, default: "#8b5cf6" },
    backgroundColor: { type: String, default: "#0f172a" },
    bgStyle: { type: String, default: "soft" },
    buttonStyle: { type: String, default: "solid" },
    radius: { type: Number, default: 18 },
    blur: { type: Number, default: 10 },
    softText: { type: Boolean, default: true },
    font: { type: String, default: "Inter, system-ui, sans-serif" },
    customBackground: { type: String, default: "" }
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
    themeConfig: {
      type: ThemeConfigSchema,
      default: () => ({})
    },

    // Public links
    links: [LinkItemSchema]
  },
  { timestamps: true }
);

export default mongoose.models.Link || mongoose.model("Link", LinkSchema);
