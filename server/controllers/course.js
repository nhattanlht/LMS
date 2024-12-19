// import { instance } from "../index.js";
import TryCatch from "../middlewares/TryCatch.js";
import { Courses } from "../models/Courses.js";
import { Lecture } from "../models/Lecture.js";
import { User } from "../models/User.js";
import crypto from "crypto";
import { Payment } from "../models/Payment.js";
import { Progress } from "../models/Progress.js";
import mongoose from "mongoose";

export const getAllCourses = TryCatch(async (req, res) => {
  const courses = await Courses.find();
  res.json({
    courses,
  });
});

export const getSingleCourse = TryCatch(async (req, res) => {
  const course = await Courses.findById(req.params.id);

  res.json({
    course,
  });
});

export const getCourseByName = TryCatch(async (req, res) => {
  const { name } = req.query;
  const courses = await Courses.find({
    $or: [
      { title: { $regex: name, $options: "i" } },
      { description: { $regex: name, $options: "i" } },
    ],
  });
  if (courses.length === 0) {
    return res.status(404).json({ message: "No courses found" });
  }

  res.status(200).json({ courses });
});

export const joinCourse = TryCatch(async (req, res) => {

  const { courseId } = req.params; // Course ID from URL
  const userId = req.user.id; // Authenticated student's ID
  
  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    return res.status(400).json({ message: "Invalid Course ID" });
  }

  // Find the user (student) and the course
  const student = await User.findById(userId);
  const course = await Courses.findById(courseId);

  if (!student) {
    return res.status(404).json({ message: "User not found" });
  }

  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  // Check if the student has already joined the course
  if (student.subscription.includes(courseId)) {
    return res.status(400).json({ message: "You have already joined this course" });
  }

  // Add course to the student's subscription array
  student.subscription.push(courseId);
  await student.save();

  // Optionally: Add student to the course's enrolled students
  if (!course.attenders) {
    course.attenders = [];
  }
  course.attenders.push(userId);
  await course.save();

  return res.status(200).json({ message: "Successfully joined the course", student });
});

export const fetchLectures = TryCatch(async (req, res) => {
  const lectures = await Lecture.find({ course: req.params.id });

  const user = await User.findById(req.user._id);

  if (user.role === "admin") {
    return res.json({ lectures });
  }

  if (!user.subscription.includes(req.params.id))
    return res.status(400).json({
      message: "You have not subscribed to this course",
    });

  res.json({ lectures });
});

export const fetchLecture = TryCatch(async (req, res) => {
  const lecture = await Lecture.findById(req.params.id);

  const user = await User.findById(req.user._id);

  if (user.role === "admin") {
    return res.json({ lecture });
  }

  if (!user.subscription.includes(lecture.course))
    return res.status(400).json({
      message: "You have not subscribed to this course",
    });

  res.json({ lecture });
});

export const getMyCourses = TryCatch(async (req, res) => {
  const courses = await Courses.find({ _id: req.user.subscription });

  res.json({
    courses,
  });
});

export const addProgress = TryCatch(async (req, res) => {
  const progress = await Progress.findOne({
    user: req.user._id,
    course: req.query.course,
  });

  const { lectureId } = req.query;

  if (progress.completedLectures.includes(lectureId)) {
    return res.json({
      message: "Progress recorded",
    });
  }

  progress.completedLectures.push(lectureId);

  await progress.save();

  res.status(201).json({
    message: "new Progress added",
  });
});

export const getYourProgress = TryCatch(async (req, res) => {
  const progress = await Progress.find({
    user: req.user._id,
    course: req.query.course,
  });

  if (!progress) return res.status(404).json({ message: "null" });

  const allLectures = (await Lecture.find({ course: req.query.course })).length;

  const completedLectures = progress[0].completedLectures.length;

  const courseProgressPercentage = (completedLectures * 100) / allLectures;

  res.json({
    courseProgressPercentage,
    completedLectures,
    allLectures,
    progress,
  });
});
