import mongoose from "mongoose";

const LinkSchema = new mongoose.Schema(
  {
    handle: { type: String, required: true, unique: true },
    profile: { type: String }, // Stores the Picture URL
    script: { type: String },  // Stores the Bio/Description
    mindset: { type: String },
    location: { type: String ,default: "Remote" },
    profession: { type: String ,default: "Creator" },
    
    // Arrays for your list items
    links: [{ 
      link: { type: String }, 
      linktext: { type: String } 
    }],
    skillsoff: [{ type: String }],
    skillsseek: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.Link || mongoose.model("Link", LinkSchema);