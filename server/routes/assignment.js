import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import { uploadFiles } from "../middlewares/multer.js";
import { 
  createAssignment,
  getStudentAssignments,
  getAssignmentDetails,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  updateSubmissionGrade,
  getAllSubmissions,
  getSubmissionDetails,
} from "../controllers/assignment.js";

const router = express.Router();

//=======assignment=======

// Tạo assignment mới (giảng viên tải file lên)
router.post("/assignment", isAuth, uploadFiles, createAssignment);

// Lấy tất cả bài tập của sinh viên
router.get("/assignment/:courseId", isAuth, getStudentAssignments);

router.get("/assignment/:courseId", isAuth, getAssignmentDetails);

// Xóa bài tập
router.delete("/assignment/:assignmentId", isAuth, deleteAssignment);

// Cập nhật bài tập
router.put("/assignment/:assignmentId", isAuth, updateAssignment);

//=======submissions=======

// Nộp bài tập (student)
router.post("/assignment/submit", isAuth, uploadFiles, submitAssignment);

// Cập nhật điểm và lời phê cho bài nộp (giảng viên)
router.patch("/assignment/:assignmentId/submission/:submissionId", isAuth, updateSubmissionGrade);

// Lấy thông tin tất cả submission
router.get("/assignments/:assignmentId/submissions", getAllSubmissions);

//lấy thông tin chi tiết một submission
router.get("/assignments/:assignmentId/submissions/:submissionId", getSubmissionDetails);

export default router;
