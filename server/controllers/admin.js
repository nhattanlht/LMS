import TryCatch from "../middlewares/TryCatch.js";
import { Courses } from "../models/Courses.js";
import { Lecture } from "../models/Lecture.js";
import { Notification } from "../models/Notification.js";
import Enrollment from "../models/Enrollment.js";
import { rm } from "fs";
import { promisify } from "util";
import fs from "fs";
import { User } from "../models/User.js";
import { handleUpload } from "../config/cloudinary2.js";
import { sendNotificationMail } from "../middlewares/sendMail.js";
import { getReceiverSocketId, io } from "../config/socket.js";

export const createCourse = TryCatch(async (req, res) => {
  const { title, description, startTime, endTime, duration, category } = req.body;
  
  if (!title || !description || !duration || !category) {
    return res.status(400).json({ message: 'All fields except image, startTime and endTime are required.' });
  }

  let cldRes;
  if(req.file){
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    cldRes = await handleUpload(dataURI, "courses");
  }
  const newCourse = new Courses({
    title,
    description,
    image: cldRes.secure_url,
    startTime,
    endTime,
    duration,
    category
  });

  await newCourse.save();

  res.status(201).json({
    message: 'Course added successfully.',
    course: newCourse,
  });
});

// Add many courses
export const createManyCourses = TryCatch(async (req, res) => {
  const { courses } = req.body;

  if (!Array.isArray(courses) || courses.length === 0) {
    return res.status(400).json({ message: 'Please provide an array of courses.' });
  }

  const createdCourses = await Courses.insertMany(courses);

  res.status(201).json({
    message: 'Courses added successfully.',
    courses: createdCourses,
  });
});

// Modify course info
export const modifyCourse = TryCatch(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const updatedCourse = await Courses.findByIdAndUpdate(id, updates, { new: true });

  if (!updatedCourse) {
    return res.status(404).json({ message: 'Course not found.' });
  }

  res.json({
    message: 'Course updated successfully.',
    course: updatedCourse,
  });
});

export const addParticipantsToCourse = TryCatch(async (req, res) => {
  const { courseId, participants } = req.body;

  if (!courseId) {
    return res.status(400).json({ message: "Course ID is required" });
  }

  if (!participants || (!Array.isArray(participants) && typeof participants !== "object")) {
    return res.status(400).json({ message: "Participants must be an array or a single participant object." });
  }

  const validRoles = ["student", "lecturer"];

  // Normalize participants to an array
  const participantList = Array.isArray(participants) ? participants : [participants];

  // Validate participants
  for (const participant of participantList) {
    if (!participant.participant_id || !validRoles.includes(participant.role)) {
      return res.status(400).json({
        message: "Each participant must have a valid participant_id and role (student or lecturer).",
      });
    }
  }

  const enrollment = await Enrollment.findOne({ course_id: courseId });

  if (!enrollment) {
    // If no enrollment exists, create a new one
    await Enrollment.create({
      course_id: courseId,
      participants: participantList,
    });
  } else {
    // If enrollment exists, add participants to it
    const participantIds = enrollment.participants.map((p) => p.participant_id.toString());

    participantList.forEach((participant) => {
      if (!participantIds.includes(participant.participant_id)) {
        enrollment.participants.push(participant);
      }
    });

    enrollment.updated_at = new Date();
    await enrollment.save();
  }

   // Update subscription for each participant

   for (const participant of participantList) {
     const user = await User.findById(participant.participant_id);
     if (user && !user.subscription.includes(courseId)) {
       user.subscription.push(courseId);
       await user.save();
     }
   }

  res.status(200).json({ message: "Participants successfully added to the course." });
});

export const addLectures = TryCatch(async (req, res) => {
  const course = await Courses.findById(req.params.id);

  if (!course)
    return res.status(404).json({
      message: "No Course with this id",
    });

  const { title, description } = req.body;

  const file = req.file;

  const lecture = await Lecture.create({
    title,
    description,
    video: file?.path,
    course: course._id,
  });

  res.status(201).json({
    message: "Lecture Added",
    lecture,
  });
});

export const deleteLecture = TryCatch(async (req, res) => {
  const lecture = await Lecture.findById(req.params.id);

  rm(lecture.video, () => {
    console.log("Video deleted");
  });

  await lecture.deleteOne();

  res.json({ message: "Lecture Deleted" });
});

const unlinkAsync = promisify(fs.unlink);

export const deleteCourse = TryCatch(async (req, res) => {
  const course = await Courses.findById(req.params.id);

  const lectures = await Lecture.find({ course: course._id });

  await Promise.all(
    lectures.map(async (lecture) => {
      await unlinkAsync(lecture.video);
      console.log("video deleted");
    })
  );

  rm(course.image, () => {
    console.log("image deleted");
  });

  await Lecture.find({ course: req.params.id }).deleteMany();

  await course.deleteOne();

  await User.updateMany({}, { $pull: { subscription: req.params.id } });

  res.json({
    message: "Course Deleted",
  });
});


// Delete many courses
export const deleteManyCourses = TryCatch(async (req, res) => {
  const { ids } = req.body;

  // Validate that ids is an array of ObjectId-like strings
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: 'Please provide a valid array of course IDs.' });
  }

  // Ensure all IDs are valid ObjectId strings
  const isValidObjectId = ids.every(id => /^[a-fA-F0-9]{24}$/.test(id));
  if (!isValidObjectId) {
    return res.status(400).json({ message: 'Invalid course ID(s) provided.' });
  }

  const deletedCourses = await Courses.deleteMany({ _id: { $in: ids } });

  res.json({
    message: `${deletedCourses.deletedCount} course(s) deleted successfully.`,
    result: deletedCourses,
  });
});

export const getAllStats = TryCatch(async (req, res) => {
  const totalCoures = (await Courses.find()).length;
  const totalLectures = (await Lecture.find()).length;
  const totalUsers = (await User.find()).length;

  const stats = {
    totalCoures,
    totalLectures,
    totalUsers,
  };

  res.json({
    stats,
  });
});

export const getAllUser = TryCatch(async (req, res) => {
  const users = await User.find({ _id: { $ne: req.user._id } }).select(
    "-password"
  );

  res.json({ users });
});

export const updateRole = TryCatch(async (req, res) => {
  if (req.user.mainrole !== "superadmin")
    return res.status(403).json({
      message: "This endpoint is assign to superadmin",
    });
  const user = await User.findById(req.params.id);

  if (user.role === "user") {
    user.role = "admin";
    await user.save();

    return res.status(200).json({
      message: "Role updated to admin",
    });
  }

  if (user.role === "admin") {
    user.role = "user";
    await user.save();

    return res.status(200).json({
      message: "Role updated",
    });
  }
});

export const sendNotification = TryCatch(async (req, res) => {
  const {recipientType, specificRecipients, subject, message } = req.body;
  const sender = req.user._id;

  let file = null;
  if(req.file){
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    const cldRes = await handleUpload(dataURI, "courses");
    file = {
      filename: req.file.originalname,
      path: cldRes.secure_url,
    };
  }

  console.log(req.body);
  if (!subject || !message || !recipientType) {
    return res.status(400).json({ message: "All fields are required" });
  }

  let recipientIds = [];

  if (recipientType === 'allUsers') {
    recipientIds = await User.find().select('_id');
  } else if (recipientType === 'allLecturers') {
    recipientIds = await User.find({ mainrole: 'lecturer' }).select('_id');
  } else if (recipientType === 'allStudents') {
    recipientIds = await User.find({ mainrole: 'student' }).select('_id');
  } else if (recipientType === 'specific') {
    const recipientsEmail = specificRecipients.split(',');
    const users = await User.find({ email: { $in: recipientsEmail } }).select('_id');
    recipientIds = users.map((user) => user._id);
  }
  
  const notification = await Notification.create({
    sender: sender,
    recipients: recipientIds,
    subject,
    message,
    file: file,
  });

  const users = await User.find({ _id: { $in: recipientIds } });
  const recipientEmails = users.map(user => user.email);

  let data;
  if(file){
    data = {sender, recipientEmails, message, file};
  }else{
    data = {sender, recipientEmails, message};
  }
  await sendNotificationMail(subject, data);

  // // Notify users via socket
  // recipientIds.forEach((recipientId) => {
  //   const recipientSocketId = getReceiverSocketId(recipientId);
  //   if (recipientSocketId) {
  //     io.to(recipientSocketId).emit("newNotification", {
  //       notificationId: notification._id,
  //       subject,
  //       message,
  //       createdAt: notification.createdAt,
  //     });
  //   }
  // });

  res.status(201).json({
    message: 'Notification created successfully.',
    notification: notification,
  });
});