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
        required: true
    },
    daplinkID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Daplink",
        default: null
    },
    isProfileComplete: {
        type: Boolean,
        default: false
    }
}, { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;