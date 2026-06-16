// models/user.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        default: ""
    },

    email: {
        type: String,
        unique: true,
        required: true
    },

    password: {
        type: String,
        required: function () {
            return !this.isGoogleuser;
        }
    },

    // Email Verification
    emailVerified: {
        type: Boolean,
        default: false
    },

    verificationToken: {
        type: String
    },

    verificationTokenExpires: {
        type: Date
    },

    theme: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Theme",
    },

    daplinkID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Link",
        default: null
    },

    plan: {
        type: String,
        default: "free"
    },

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

    isGoogleuser: {
        type: Boolean,
        default: false
    },

    onboarding: {
        completed: {
            type: Boolean,
            default: false
        },
        currentStep: {
            type: Number,
            default: 0
        }
    },

    // Forgot Password
    resetPasswordToken: {
        type: String
    },

    resetPasswordExpires: {
        type: Date
    }

}, {
    timestamps: true
});

const User =
    mongoose.models.User ||
    mongoose.model("User", userSchema);

export default User;