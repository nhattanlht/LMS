import express from "express";
const router = express.Router();
import { protect, authorize } from "../middlewares/isAuth.js";
import {
  createGrade,
  getGrades,
  updateGrade,
  deleteGrade,
} from "../controllers/grade.js";

// Route cho giáo viên
router.post('/', protect, authorize('teacher'), createGrade);
router.put('/', protect, authorize('teacher'), updateGrade);
router.delete('/:gradeId', protect, authorize('teacher'), deleteGrade);

// Route cho sinh viên và giáo viên
router.get('/', protect, getGrades);

export default router;