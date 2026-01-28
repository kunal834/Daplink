import mongoose, { } from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        default: ""
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: { 
    type: String, 
    required: function() {
      // Only require password if there is no googleId (or similar flag)
      // For now, just making it optional is easiest
      return false; 
    }
  },
    theme:{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Theme",
    },
    daplinkID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Link",
        default: null
    },
    plan: { type: String, default: "free" },
    isProfileComplete: {
        type: Boolean,
        default: false
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    isGoogleuser : { type: Boolean , default: false},
    onboarding: {
    completed: { type: Boolean, default: false },
    currentStep: { type: Number, default: 0 }
  },

}, { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;