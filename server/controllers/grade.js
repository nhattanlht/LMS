import { Grade } from '../models/Grade.js';
import TryCatch from '../middlewares/TryCatch.js';

// Tạo điểm số
export const createGrade = TryCatch(async (req, res) => {
  const { studentId, courseId, grade } = req.body;
  const createdBy = req.user._id;

  const newGrade = await Grade.create({
    student: studentId,
    course: courseId,
    grade,
    createdBy,
  });

  res.status(201).json({
    message: 'Grade created successfully',
    data: newGrade,
  });
});

// Xem điểm số
export const getGrades = TryCatch(async (req, res) => {
  const { studentId, courseId } = req.query;

  const query = {};
  if (studentId) query.student = studentId;
  if (courseId) query.course = courseId;

  const grades = await Grade.find(query).populate('student course', 'name email title');

  res.status(200).json({
    message: 'Grades retrieved successfully',
    data: grades,
  });
});

// Chỉnh sửa điểm số
export const updateGrade = TryCatch(async (req, res) => {
  const { gradeId, grade } = req.body;

  const updatedGrade = await Grade.findByIdAndUpdate(
    gradeId,
    { grade, updatedAt: Date.now() },
    { new: true }
  );

  res.status(200).json({
    message: 'Grade updated successfully',
    data: updatedGrade,
  });
});

// Xóa điểm số
export const deleteGrade = TryCatch(async (req, res) => {
  const { gradeId } = req.params;

  await Grade.findByIdAndDelete(gradeId);

  res.status(200).json({
    message: 'Grade deleted successfully',
  });
});