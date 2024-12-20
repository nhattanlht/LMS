import express from "express";
const router = express.Router();
import { protect } from "../middlewares/isAuth.js";
import {
    createForum,
    createThread,
    createPost,
    getForums,
    getThreads,
    getPosts,
} from "../controllers/forum.js";            
router.post('/forums', protect, createForum);
router.post('/threads', protect, createThread);
router.post('/posts', protect, createPost);
router.get('/forums', protect, getForums);
router.get('/threads/:forumId', protect, getThreads);
router.get('/posts/:threadId', protect, getPosts);
export default router;