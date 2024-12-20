import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    content: {
      type: String,
      required: true,
    },
    thread: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Thread',
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });

export const Post = mongoose.model('Post', postSchema);