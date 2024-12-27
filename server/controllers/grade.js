import Grade from '../models/Grade.js';
import TryCatch from '../middlewares/TryCatch.js';
import { User } from '../models/User.js';
import { Activity } from '../models/Activity.js';
import { Courses } from '../models/Courses.js';
import CourseHasActivities from '../models/CourseHasActivities.js';
import Enrollment from '../models/Enrollment.js';

// Tạo điểm số
export const createGrade = TryCatch(async (req, res) => {
  const { student_id, activity_id, grade, coefficient } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  const activity = await Activity.findById(activity_id);
  if (!activity) {
    return res.status(400).json({
      success: false,
      message: 'Activity not found'
    });
  }
  
  const courseActivity = await CourseHasActivities.findOne({ 'activities.activity_id': activity_id });
  if (!courseActivity) {
    return res.status(404).json({
      success: false,
      message: 'Activity not found in any course'
    });
  }
  const course = await Courses.findById(courseActivity.course_id);
  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }
  // Kiểm tra xem giảng viên có dạy khóa học này không
  const isTeaching = await Enrollment.findOne({
    course_id: course._id,
    'participants.participant_id': user._id,
    'participants.role': 'lecturer',
  });
  if (!isTeaching) {
    return res.status(403).json({
      success: false,
      message: 'You are not authorized to enter grades for this course',
    });
  }  
  
  const studentEnroll = await Enrollment.findOne({ 
    course_id: course._id,
    'participants.participant_id': student_id,
    'participants.role': 'student',
  });
  if (!studentEnroll) {
    return res.status(400).json({
      success: false,
      message: 'Student is not enrolled in the course'
    });
  }

  if (grade > 10 && grade < 0) {
    return res.status(400).json({
      success: false,
      message: `Grade exceeds the maximum limit of [0, 10]`,
    });
  }

  if (!student_id || !activity_id || !grade || !coefficient) {
    return res.status(400).json({
      message: 'Please fill in all fields',
    });
  }
  const newGrade = await Grade.create({
    student_id,
    activity_id,
    grade,
    coefficient,
  });

  res.status(201).json({
    message: 'Grade created successfully',
    data: newGrade,
  });
});

// Xem điểm số
export const getGrades = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  const { activityId } = req.query;
  if (!activityId) {
    return res.status(400).json({
      success: false,
      message: 'Activity ID is required'
    });
  }
  let filter = {};
  // Nếu là sinh viên, chỉ xem điểm của chính mình
  if (user.role === 'student') {
      const courseActivity = await CourseHasActivities.findOne({ 'activities.activity_id': activityId });
      if (!courseActivity) {
        return res.status(404).json({
          success: false,
          message: 'Activity not found in any course'
        });
      }
      const enrollment = await Enrollment.findOne({
        course_id: courseActivity.course_id,
        'participants.participant_id': user._id,
        'participants.role': 'student'
      });
      if (!enrollment) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to view grades for this activity'
        });
      }
      filter = { 
        student_id: user._id,
        activity_id: activityId 
    };
  }
  // Nếu là giảng viên, chỉ lấy những grades có activity_id do giảng viên dạy
  else if (user.role === 'lecturer') {
    const { activityId } = req.query;
    if (!activityId) {
      return res.status(400).json({
        success: false,
        message: 'Activity ID is required'
      });
    }

    // Tìm course_id từ activity_id trong Course_Has_Activities
    const courseActivity = await CourseHasActivities.findOne({ 'activities.activity_id': activityId });
    if (!courseActivity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found in any course'
      });
    }

    // Kiểm tra giảng viên có dạy khóa học này không
    const enrollment = await Enrollment.findOne({
      course_id: courseActivity.course_id,
      'participants.participant_id': user._id,
      'participants.role': 'lecturer'
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view grades for this activity'
      });
    }

    filter.activity_id = activityId;
  }

  const grades = await Grade.find(filter)
    .populate('student_id', 'name email')
    .populate('activity_id', 'title description lecturer_id');

  // Trường hợp không tìm thấy grade nào
  if (!grades.length) {
    return res.status(404).json({
      success: false,
      message: 'No grades found for the current user'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Grades retrieved successfully',
    data: grades
  });
});

export const getAllGradesForCourse = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  const { courseId } = req.query;
  if (!courseId) {
    return res.status(400).json({
      success: false,
      message: 'Course ID is required',
    });
  }

  const course = await Courses.findById(courseId);
  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found',
    });
  }

  // Lấy tất cả hoạt động liên quan đến khóa học
  const courseActivities = await CourseHasActivities.findOne({ course_id: course._id });
  if (!courseActivities || !courseActivities.activities.length) {
    return res.status(404).json({
      success: false,
      message: 'No activities found for this course',
    });
  }

  const activityIds = courseActivities.activities.map(activity => activity.activity_id);

  let grades;
  if (user.role === 'student') {
    // Kiểm tra xem sinh viên có tham gia khóa học này không
    const enrollment = await Enrollment.findOne({
      course_id: course._id,
      'participants.participant_id': user._id,
      'participants.role': 'student',
    });
    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'You are not enrolled in this course',
      });
    }

    // Lấy điểm của sinh viên cho các hoạt động trong khóa học
    grades = await Grade.find({
      student_id: user._id,
      activity_id: { $in: activityIds },
    })
      .populate('student_id', 'name email')
      .populate('activity_id', 'title description');
  } else if (user.role === 'lecturer') {
    // Kiểm tra xem giảng viên có dạy khóa học này không
    const isTeaching = await Enrollment.findOne({
      course_id: course._id,
      'participants.participant_id': user._id,
      'participants.role': 'lecturer',
    });
    if (!isTeaching) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view grades for this course',
      });
    }

    // Lấy tất cả điểm của các sinh viên trong khóa học
    grades = await Grade.find({
      activity_id: { $in: activityIds },
    })
      .populate('student_id', 'name email')
      .populate('activity_id', 'title description');
  } else {
    return res.status(403).json({
      success: false,
      message: 'You are not authorized to view grades for this course',
    });
  }

  if (!grades.length) {
    return res.status(404).json({
      success: false,
      message: 'No grades found for this course',
    });
  }

  res.status(200).json({
    success: true,
    data: grades,
  });
});

// Chỉnh sửa điểm số
export const updateGrade = TryCatch(async (req, res) => {
  const { gradeId } = req.params;
  const { grade, coefficient } = req.body;
  const { activityId } = req.query;

  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  const gradeToUpdate = await Grade.findById(gradeId);
  if (!gradeToUpdate) {
    return res.status(404).json({
      success: false,
      message: 'Grade not found'
    });
  }

  // Nếu là giảng viên, kiểm tra giảng viên có dạy môn học có activity_id đó không
  if (user.role === 'lecturer') {
    // Tìm course_id từ activity_id trong Course_Has_Activities
    const courseActivity = await CourseHasActivities.findOne({ 'activities.activity_id': activityId });
    if (!courseActivity) {
      console.log('Activity ID:', activityId);
      return res.status(404).json({
        success: false,
        message: 'Activity not found in any course'
      });
    }

    // Kiểm tra giảng viên có dạy khóa học này không
    const enrollment = await Enrollment.findOne({
      course_id: courseActivity.course_id,
      'participants.participant_id': user._id,
      'participants.role': 'lecturer'
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update grades for this activity'
      });
    }
  } else {
    return res.status(403).json({
      success: false,
      message: 'Only lecturers can update grades'
    });
  }

  const updatedGrade = await Grade.findByIdAndUpdate(
    gradeId,
    { grade, coefficient },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: 'Grade updated successfully',
    data: updatedGrade,
  });
});

// Xóa điểm số
export const deleteGrade = TryCatch(async (req, res) => {
  const { gradeId } = req.params;
  const { activityId } = req.query;

  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  const gradeToUpdate = await Grade.findById(gradeId);
  if (!gradeToUpdate) {
    return res.status(404).json({
      success: false,
      message: 'Grade not found'
    });
  }

  // Nếu là giảng viên, kiểm tra giảng viên có dạy môn học có activity_id đó không
  if (user.role === 'lecturer') {
    // Tìm course_id từ activity_id trong Course_Has_Activities
    const courseActivity = await CourseHasActivities.findOne({ 'activities.activity_id': activityId });
    if (!courseActivity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found in any course'
      });
    }

    // Kiểm tra giảng viên có dạy khóa học này không
    const enrollment = await Enrollment.findOne({
      course_id: courseActivity.course_id,
      'participants.participant_id': user._id,
      'participants.role': 'lecturer'
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete grades for this activity'
      });
    }
  } else {
    return res.status(403).json({
      success: false,
      message: 'Only lecturers can delete grades'
    });
  }

  await Grade.findByIdAndDelete(gradeId);

  res.status(200).json({
    message: 'Grade deleted successfully',
  });
});