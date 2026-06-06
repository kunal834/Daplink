import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    handle: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ["text", "poll", "audio"],
      default: "text"
    },
    content: {
      type: String,
      required: true
    },
    pollOptions: [
      {
        optionText: { type: String, required: true },
        votes: { type: Number, default: 0 }
      }
    ],
    pollVoters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    audioUrl: {
      type: String,
      default: ""
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    views: {
      type: Number,
      default: 0
    },
    score: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

const Post = mongoose.models.Post || mongoose.model("Post", PostSchema);
export default Post;
