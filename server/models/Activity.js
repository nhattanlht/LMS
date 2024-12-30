import mongoose from 'mongoose';

const ActivitySchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  open_at: {
    type: Date,
    required: true
  },
  end_at: {
    type: Date,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  file: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
  collection: 'activity'
});

export const Activity = mongoose.model('Activity', ActivitySchema);