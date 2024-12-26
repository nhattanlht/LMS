import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
    activity_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Activity',
      required: true
    },
    created_at: {
      type: Date,
      default: Date.now
    },
    created_by: {
      type: String,
      required: true
    },
    updated_at: {
      type: Date,
      required: true
    }
});

const courseHasActivitiesSchema = new mongoose.Schema({
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  activities: [activitySchema]
},
{
  timestamps: true,
  collection: 'course_has_activities'
});

const CourseHasActivities = mongoose.model('CourseHasActivities', courseHasActivitiesSchema);
export default CourseHasActivities;