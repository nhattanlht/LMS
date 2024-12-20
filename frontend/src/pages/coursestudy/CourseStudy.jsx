import React, { useEffect } from "react";
import "./coursestudy.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";
import { server } from "../../main";

const CourseStudy = ({ user }) => {
  const params = useParams();

  const { fetchCourse, course } = CourseData();
  const navigate = useNavigate();

  if (user && user.role !== "admin" && !user.subscription.includes(params.id))
    return navigate("/");

  useEffect(() => {
    fetchCourse(params.id);
  }, []);
  return (
    <>
      {course && (
        <div className="course-study-page">
        <div className="course-box">
          <img src={`${server}/${course.image}`} alt="" width={350} />
          <h4>Title: {course.title}</h4>
          <h5>Description: {course.description}</h5>
          <h5>Start: {new Date(course.startTime).toLocaleDateString('en-GB', { timeZone: 'UTC' })}</h5>
          <h5>End: {new Date(course.endTime).toLocaleDateString('en-GB', { timeZone: 'UTC' })}</h5>
          <Link to={`/lectures/${course._id}`}>
           <a>Lecture</a>
          </Link>
        </div>
      </div>
      
      )}
    </>
  );
};

export default CourseStudy;
