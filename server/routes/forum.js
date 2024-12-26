import express from "express";
const router = express.Router();
import { isAuth } from "../middlewares/isAuth.js";
import {
    createForum,
    createThread,
    createPost,
    getForums,
    getThreads,
    getPosts,
} from "../controllers/forum.js";            
router.post('/forums', isAuth, createForum);
router.post('/threads', isAuth, createThread);
router.post('/posts', isAuth, createPost);
router.get('/forums', isAuth, getForums);
router.get('/threads/:forumId', isAuth, getThreads);
router.get('/posts/:threadId', isAuth, getPosts);
export default router;