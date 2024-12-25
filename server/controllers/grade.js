import Grade from '../models/Grade.js';
import TryCatch from '../middlewares/TryCatch.js';

// Tạo điểm số
export const createGrade = TryCatch(async (req, res) => {
  const { student_id, activity_id, grade, coefficient } = req.body;

  if (!student_id || !activity_id || !grade || !coefficient) {
    return res.status(400).json({
      message: 'Please fill in all fields',
    });
  }
  const newGrade = await Grade.create({
    student_id,
    activity_id,
    grade,
    coefficient,
  });

  res.status(201).json({
    message: 'Grade created successfully',
    data: newGrade,
  });
});

// Xem điểm số
export const getGrades = TryCatch(async (req, res) => {
  const grades = await Grade.find().populate('student_id activity_id');

  res.status(200).json({
    message: 'Grades retrieved successfully',
    data: grades,
  });
});

// Chỉnh sửa điểm số
export const updateGrade = TryCatch(async (req, res) => {
  const { gradeId } = req.params;
  const { grade, coefficient } = req.body;

  const updatedGrade = await Grade.findByIdAndUpdate(
    gradeId,
    { grade, coefficient },
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