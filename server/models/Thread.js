import mongoose from "mongoose";

const threadSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    forum: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Forum',
      required: true,
    },
    posts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    }],
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

export const Thread = mongoose.model('Thread', threadSchema);