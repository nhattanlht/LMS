import express from "express";
import { getMessages, sendMessage, getConversations, markMessagesAsRead} from "../controllers/message.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

router.get("/rec/:id", isAuth, getMessages);
router.post("/send/:id", isAuth, sendMessage);
router.get("/conversations", isAuth, getConversations);
router.put("/markRead/:conversationId", isAuth, markMessagesAsRead);

export default router;