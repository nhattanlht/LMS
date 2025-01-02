import TryCatch from "../middlewares/TryCatch.js";
import cloudinary from "../config/cloudinary.js";
import { Assignment } from "../models/Assignment.js";

export const createAssignment = TryCatch(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // Upload file lên Cloudinary
  const result = await cloudinary.uploader.upload(req.file.path, {
    resource_type: "auto", // Hỗ trợ các định dạng file như PDF, DOCX
  });

  // Kiểm tra courseId
  if (!req.body.courseId) {
    return res.status(400).json({ message: "Course ID is required" });
  }

  // Kiểm tra tính hợp lệ của `type`
  const validTypes = ["assignment", "quiz", "project"];
  if (req.body.type && !validTypes.includes(req.body.type)) {
    return res.status(400).json({ message: "Invalid assignment type" });
  }

  // Tạo assignment
  const assignment = await Assignment.create({
    title: req.body.title,
    description: req.body.description,
    instructorFile: result.secure_url,
    startDate: req.body.startDate,
    dueDate: req.body.dueDate,
    courseId: req.body.courseId,
    instructor: req.user._id,
    type: req.body.type || "assignment", // Nếu không gửi type, mặc định là "assignment"
  });

  res.status(201).json({ message: "Assignment created successfully", assignment });
});

export const submitAssignment = TryCatch(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // Upload file của sinh viên lên Cloudinary
  const result = await cloudinary.uploader.upload(req.file.path, {
    resource_type: "auto",
  });

  // Lấy bài tập bằng ID
  const assignment = await Assignment.findById(req.body.assignmentId);

  if (!assignment) {
    return res.status(404).json({ message: "Assignment not found" });
  }

  // Kiểm tra nếu sinh viên đã nộp bài trước đó
  const existingSubmission = assignment.submissions.find(
    (submission) => submission.student.toString() === req.user._id.toString()
  );

  if (existingSubmission) {
    return res.status(400).json({ message: "You have already submitted this assignment" });
  }

  // Thêm thông tin nộp bài
  assignment.submissions.push({
    student: req.user._id,
    fileUrl: result.secure_url,
  });

  await assignment.save();

  res.status(200).json({ message: "Assignment submitted successfully", assignment });
});

export const updateSubmissionGrade = TryCatch(async (req, res) => {
  const { assignmentId, submissionId } = req.params;
  const { grade, comment } = req.body;

  // Kiểm tra tính hợp lệ của grade
  if (grade < 0 || grade > 100) {
    return res.status(400).json({ message: "Grade must be between 0 and 100" });
  }

  // Tìm bài tập bằng ID
  const assignment = await Assignment.findById(assignmentId);

  if (!assignment) {
    return res.status(404).json({ message: "Assignment not found" });
  }

  // Tìm submission trong danh sách submissions
  const submission = assignment.submissions.id(submissionId);

  if (!submission) {
    return res.status(404).json({ message: "Submission not found" });
  }

  // Cập nhật điểm và bình luận
  if (grade !== undefined) submission.grade = grade;
  if (comment !== undefined) submission.comment = comment;

  // Lưu lại assignment sau khi cập nhật
  await assignment.save();

  res.status(200).json({
    message: "Submission updated successfully",
    submission,
  });
});


export const getStudentAssignments = TryCatch(async (req, res) => {
  const { courseId } = req.params;

  // Lấy danh sách bài tập theo khóa học
  const assignments = await Assignment.find({ courseId });

  res.status(200).json({
    message: "Student's assignments fetched successfully",
    assignments,
  });
});

export const getAssignmentDetails = TryCatch(async (req, res) => {
  const { assignmentId } = req.params;

  const assignment = await Assignment.findById(assignmentId)
    .populate("instructor", "name email")
    .populate("submissions.student", "name email");

  if (!assignment) {
    return res.status(404).json({ message: "Assignment not found" });
  }

  res.status(200).json({
    message: "Assignment details fetched successfully",
    assignment,
  })
});

export const updateAssignment = TryCatch(async (req, res) => {
  const { assignmentId } = req.params;

  const updateData = {
    title: req.body.title,
    description: req.body.description,
    startDate: req.body.startDate,
    dueDate: req.body.dueDate,
    type: req.body.type, // Cho phép cập nhật loại bài tập
  };

  // Kiểm tra tính hợp lệ của `type`
  const validTypes = ["assignment", "quiz", "project"];
  if (updateData.type && !validTypes.includes(updateData.type)) {
    return res.status(400).json({ message: "Invalid assignment type" });
  }

  const assignment = await Assignment.findByIdAndUpdate(assignmentId, updateData, {
    new: true,
  });

  if (!assignment) {
    return res.status(404).json({ message: "Assignment not found" });
  }

  res.status(200).json({
    message: "Assignment updated successfully",
    assignment,
  });
});

export const deleteAssignment = TryCatch(async (req, res) => {
  const { assignmentId } = req.params;

  const assignment = await Assignment.findByIdAndDelete(assignmentId);

  if (!assignment) {
    return res.status(404).json({ message: "Assignment not found" });
  }

  res.status(200).json({ message: "Assignment deleted successfully" });
});

export const getSubmissionDetails = TryCatch(async (req, res) => {
  const { assignmentId, submissionId } = req.params;

  // Tìm bài tập bằng assignmentId
  const assignment = await Assignment.findById(assignmentId)
    .populate("submissions.student", "name email"); // Lấy thông tin sinh viên nộp bài

  if (!assignment) {
    return res.status(404).json({ message: "Assignment not found" });
  }

  // Tìm submission theo submissionId trong danh sách submissions
  const submission = assignment.submissions.id(submissionId);

  if (!submission) {
    return res.status(404).json({ message: "Submission not found" });
  }

  res.status(200).json({
    message: "Submission details fetched successfully",
    submission,
  });
});

export const getAllSubmissions = TryCatch(async (req, res) => {
  const { assignmentId } = req.params;

  // Tìm bài tập theo assignmentId
  const assignment = await Assignment.findById(assignmentId)
    .populate("submissions.student", "name email"); // Lấy thông tin sinh viên nộp bài

  if (!assignment) {
    return res.status(404).json({ message: "Assignment not found" });
  }

  // Lấy tất cả submissions của bài tập
  const submissions = assignment.submissions;

  res.status(200).json({
    message: "All submissions fetched successfully",
    submissions,
  });
});

