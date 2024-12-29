import { Forum } from "../models/Forum.js";
import TryCatch from "../middlewares/TryCatch.js";
import Enrollment from "../models/Enrollment.js";
import { User } from "../models/User.js";

export const createForum = TryCatch(async (req, res) => {
  const { courseId, title } = req.body;
  const createdBy = req.user._id;

  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  const enroll = await Enrollment.findOne({ 
    course_id: courseId, 
    'participants.participant_id': user._id, 
  });

  if (!enroll) {
    return res.status(403).json({
      message: 'You are not enrolled in this course',
    });
  }

  const forum = await Forum.create({
    courseId,
    title,
    createdBy,
  });

  res.status(201).json({
    message: 'Forum created successfully',
    data: forum,
  });
});

export const createQuestion = TryCatch(async (req, res) => {
  const { forumId } = req.params;
  const { title, content } = req.body;
  const createdBy = req.user._id;

  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  const forum = await Forum.findById(forumId).populate('courseId');
  if (!forum) {
    return res.status(404).json({
      message: 'Forum not found',
    });
  }

  const enroll = await Enrollment.findOne({ 
    course_id: forum.courseId._id, 
    'participants.participant_id': user._id,
  });

  if (!enroll) {
    return res.status(403).json({
      message: 'You are not enrolled in this course',
    });
  }

  const question = {
    title,
    content,
    createdBy,
  };

  await Forum.findByIdAndUpdate(forumId, {
    $push: { questions: question },
  });

  res.status(201).json({
    message: 'Question added successfully',
    data: question,
  });
});

export const createAnswer = TryCatch(async (req, res) => {
  const { forumId, questionId } = req.params
  const { content } = req.body;
  const createdBy = req.user._id;

  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  const forum = await Forum.findById(forumId).populate('courseId');
  if (!forum) {
    return res.status(404).json({
      message: 'Forum not found',
    });
  }
  
  const question = forum.questions.find(q => q._id == questionId);
  if (!question) {
    return res.status(404).json({
      message: 'Question not found',
    });
  }

  const enroll = await Enrollment.findOne({ 
    course_id: forum.courseId._id, 
    'participants.participant_id': user._id,
  });

  if (!enroll) {
    return res.status(403).json({
      message: 'You are not enrolled in this course',
    });
  }

  const answer = {
    content,
    createdBy,
  };

  question.answers.push(answer);
  await forum.save();

  res.status(201).json({
    message: 'Answer added successfully',
    data: answer,
  });
});

export const getForums = TryCatch(async (req, res) => {
  const { courseId } = req.query;
  const forums = await Forum.find({ course: courseId}).populate('course createdBy');

  const enroll = await Enrollment.findOne({ 
    course_id: courseId, 
    'participants.participant_id': createdBy, 
  });

  if (!enroll) {
    return res.status(403).json({
      message: 'You are not enrolled in this course',
    });
  }

  res.status(200).json({
    message: 'Forums retrieved successfully',
    data: forums,
  });
});

export const getQuestions = TryCatch(async (req, res) => {
  const { forumId } = req.params;
  const forum = await Forum.findById(forumId).populate('questions.createdBy');

  if (!forum) {
    return res.status(404).json({
      message: 'Forum not found',
    });
  }

  res.status(200).json({
    message: 'Questions retrieved successfully',
    data: forum.questions,
  });
});

export const getAnswers = TryCatch(async (req, res) => {
  const { forumId, questionId } = req.params;
  const forum = await Forum.findOne(
    { _id: forumId, "questions._id": questionId },
    { "questions.$": 1 }
  ).populate('questions.answers.createdBy');

  if (!forum || forum.questions.length === 0) {
    return res.status(404).json({
      message: 'Question not found',
    });
  }

  res.status(200).json({
    message: 'Answers retrieved successfully',
    data: forum.questions[0].answers,
  });
});