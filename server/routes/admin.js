import express from "express";
import { isAdmin, isAuth } from "../middlewares/isAuth.js";
import {
  addLectures,
  createCourse,
  createManyCourses,
  modifyCourse,
  deleteCourse,
  deleteManyCourses,
  deleteLecture,
  getAllStats,
  getAllUser,
  updateRole,
  sendNotification,
  addParticipantsToCourse,
} from "../controllers/admin.js";
import { uploadFiles } from "../middlewares/multer2.js";

const router = express.Router();

router.post("/course/new", isAuth, isAdmin, uploadFiles, createCourse);
router.post("/course/many", isAuth, isAdmin, createManyCourses);
router.put("/course/:id", isAuth, isAdmin, modifyCourse);
router.post("/course/add/participants", isAuth, isAdmin, addParticipantsToCourse);
router.post("/course/:id", isAuth, isAdmin, uploadFiles, addLectures);
router.delete("/course/:id", isAuth, isAdmin, deleteCourse);
router.delete("/course", isAuth, isAdmin, deleteManyCourses);
router.delete("/lecture/:id", isAuth, isAdmin, deleteLecture);
router.get("/stats", isAuth, isAdmin, getAllStats);
router.put("/user/:id", isAuth, updateRole);
router.get("/users", isAuth, isAdmin, getAllUser);
router.post("/notification", isAuth, isAdmin, uploadFiles, sendNotification);

export default router;
