import express from "express";
import { getMessages, sendMessage } from "../controllers/message.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

router.get("/rec/:id", isAuth, getMessages);
router.post("/send/:id", isAuth, sendMessage);

export default router;