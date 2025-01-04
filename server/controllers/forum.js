import { Forum } from "../models/Forum.js";
import TryCatch from "../middlewares/TryCatch.js";

export const createForum = TryCatch(async (req, res) => {
  const { course, title } = req.body;
  const createdBy = req.user._id;

  const forum = await Forum.create({
    course,
    title,
    createdBy,
  });

  res.status(201).json({
    message: 'Forum created successfully',
    data: forum,
  });
});

export const createQuestion = TryCatch(async (req, res) => {
  const { forumId, title, content } = req.body;
  const createdBy = req.user._id;

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
  const { forumId, questionId, content } = req.body;
  const createdBy = req.user._id;

  const answer = {
    content,
    createdBy,
  };

  await Forum.updateOne(
    { _id: forumId, "questions._id": questionId },
    { $push: { "questions.$.answers": answer } }
  );

  res.status(201).json({
    message: 'Answer added successfully',
    data: answer,
  });
});

export const getForums = TryCatch(async (req, res) => {
  const { courseId } = req.query;
  const forums = await Forum.find({ course: courseId}).populate('course createdBy', 'title name');

  res.status(200).json({
    message: 'Forums retrieved successfully',
    data: forums,
  });
});

export const getQuestions = TryCatch(async (req, res) => {
  const { forumId } = req.params;
  const forum = await Forum.findById(forumId).populate('questions.createdBy', 'name');

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
  ).populate('questions.answers.createdBy', 'name');

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