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

module.exports = mongoose.model('Forum', forumSchema);

export const Message = mongoose.model('Forum', forumSchema);