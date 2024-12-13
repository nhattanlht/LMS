import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    type: { type: String, required: true, enum: ['assignment', 'test'] },
    openAt: { type: Date, required: true },
    endAt: { type: Date, required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Courses', required: true },
    submissions: [{
      student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      file: { type: String },
      status: String,
      submitAt: { type: Date },
      grade: { type: Number },
      coefficient: { type: Number },
    }],
    createdAt: { type: Date, default: Date.now }
});

export const Assignment = mongoose.model('Assignment', assignmentSchema);
