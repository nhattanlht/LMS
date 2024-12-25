import express from "express";
const router = express.Router();
import { isLecturer, isStudent } from "../middlewares/isAuth.js";
import {
    createForum,
    createThread,
    createPost,
    getForums,
    getThreads,
    getPosts,
} from "../controllers/forum.js";            
router.post('/forums', isStudent, isLecturer, createForum);
router.post('/threads', isStudent, isLecturer, createThread);
router.post('/posts', isStudent, isLecturer, createPost);
router.get('/forums', isStudent, isLecturer, getForums);
router.get('/threads/:forumId', isStudent, isLecturer, getThreads);
router.get('/posts/:threadId', isStudent, isLecturer, getPosts);
export default router;