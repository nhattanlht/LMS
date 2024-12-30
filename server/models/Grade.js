import mongoose from 'mongoose';

const GradeSchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  activity_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Activity',
    required: true,
  },
  grade: {
    type: Number,
    ref: 'submission',
    required: true,
  },
  coefficient: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
  collection: 'grades'
});

const Grade = mongoose.model('Grade', GradeSchema);

export default Grade;