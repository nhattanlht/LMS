import express from "express";
const router = express.Router();
import { isAuth } from "../middlewares/isAuth.js";
import {
    createForum,
    createQuestion,
    createAnswer,
    getForums,
    getQuestions,
    getAnswers,
} from "../controllers/forum.js";            
router.post('/forums', isAuth, createForum);
router.post('/forums/question', isAuth, createQuestion);
router.post('/forums/answer', isAuth, createAnswer);
router.get('/forums', isAuth, getForums);
router.get('/forums/:forumId', isAuth, getQuestions);
router.get('/posts/:forumId/:questionId', isAuth, getAnswers);
export default router;