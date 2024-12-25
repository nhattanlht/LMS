import mongoose from "mongoose";

const forumSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  threads: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Thread',
  }],
});

export const Forum = mongoose.model('Forum', forumSchema);