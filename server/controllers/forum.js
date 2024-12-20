import { Forum } from "../models/Forum.js";
import { Thread } from "../models/Thread.js";
import { Post } from "../models/Post.js";
import TryCatch from "../middlewares/TryCatch.js";

export const createForum = TryCatch(async (req, res) => {
  const { title, description } = req.body;

  const forum = await Forum.create({
    title,
    description,
  });

  res.status(201).json({
    message: 'Forum created successfully',
    data: forum,
  });
});

export const createThread = TryCatch(async (req, res) => {
  const { forumId, title } = req.body;
  const createdBy = req.user._id;

  const thread = await Thread.create({
    title,
    forum: forumId,
    createdBy,
  });

  await Forum.findByIdAndUpdate(forumId, {
    $push: { threads: thread._id },
  });

  res.status(201).json({
    message: 'Thread created successfully',
    data: thread,
  });
});

export const createPost = TryCatch(async (req, res) => {
  const { threadId, content } = req.body;
  const createdBy = req.user._id;

  const post = await Post.create({
    content,
    thread: threadId,
    createdBy,
  });

  await Thread.findByIdAndUpdate(threadId, {
    $push: { posts: post._id },
  });

  res.status(201).json({
    message: 'Post created successfully',
    data: post,
  });
});

export const getForums = TryCatch(async (req, res) => {
  const forums = await Forum.find().populate('threads');

  res.status(200).json({
    message: 'Forums retrieved successfully',
    data: forums,
  });
});

export const getThreads = TryCatch(async (req, res) => {
  const { forumId } = req.params;
  const threads = await Thread.find({ forum: forumId }).populate('posts');

  res.status(200).json({
    message: 'Threads retrieved successfully',
    data: threads,
  });
});

export const getPosts = TryCatch(async (req, res) => {
  const { threadId } = req.params;
  const posts = await Post.find({ thread: threadId }).populate('createdBy', 'name email');

  res.status(200).json({
    message: 'Posts retrieved successfully',
    data: posts,
  });
});