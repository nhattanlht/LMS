import express from "express";
import {
  getAllCourses,
  getSingleCourse,
  getCourseByName,
  joinCourse,
  fetchLectures,
  fetchLecture,
  getMyCourses,
  sendNotificationToCourseStudents,
} from "../controllers/course.js";
import { isAuth, isLecturer, isStudent } from "../middlewares/isAuth.js";
import { uploadFiles } from "../middlewares/multer2.js";

const router = express.Router();

router.get("/course/all", getAllCourses);
router.get("/course/one", getCourseByName);
router.get("/course/:id", getSingleCourse);
router.post("/course/join/:courseId", isAuth, isStudent, joinCourse);
router.get("/lectures/:id", isAuth, fetchLectures);
router.get("/lecture/:id", isAuth, fetchLecture);
router.get("/mycourse", isAuth, getMyCourses);
router.post('/course/:id/notification', isAuth, isLecturer, uploadFiles, sendNotificationToCourseStudents)
export default router;
