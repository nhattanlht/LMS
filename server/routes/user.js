import express from "express";
import {
  forgotPassword,
  loginUser,
  myProfile,
  register,
  resetPassword,
  verifyUser,
} from "../controllers/user.js";
import { isAuth } from "../middlewares/isAuth.js";
import { addProgress, getYourProgress } from "../controllers/course.js";
import { registerLimiter, loginLimiter } from "../middlewares/rateLimit.js";
import { registerValidation, validate } from "../middlewares/validateInput.js";

const router = express.Router();

// Register a new user
router.post("/user/register", register, registerValidation, validate, registerLimiter);
router.post("/user/verify", verifyUser);

// Login a user
router.post("/user/login", loginUser, loginLimiter);

// Get user profile
router.get("/user/me", isAuth, myProfile);

// Forgot and reset password
router.post("/user/forgot", forgotPassword);
router.post("/user/reset", resetPassword);

// Add and get progress
router.post("/user/progress", isAuth, addProgress);
router.get("/user/progress", isAuth, getYourProgress);

export default router;
