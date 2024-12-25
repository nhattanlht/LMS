import express from "express";
const router = express.Router();
import { isAuth, isLecturer, isStudent } from "../middlewares/isAuth.js";
import {
  createGrade,
  getGrades,
  updateGrade,
  deleteGrade,
} from "../controllers/grade.js";

// Route cho giáo viên
router.post('/grades', isAuth, isLecturer, createGrade);
router.put('/grades/:gradeId', isAuth, isLecturer, updateGrade);
router.delete('/grades/:gradeId', isAuth, isLecturer, deleteGrade);

// Route cho sinh viên và giáo viên
router.get('/grades', isAuth, getGrades);

export default router;