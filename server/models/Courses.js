import mongoose from "mongoose";

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String
  },
  startTime: Date,
  endTime: Date,
  duration: {
    type: Number,
    required: true,
  },
  resources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resources' }],
  assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' }],
  category: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  attenders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

export const Courses = mongoose.model("Courses", schema);
