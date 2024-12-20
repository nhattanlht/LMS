import React from "react";
import "./courseCard.css";
import { server } from "../../main";
import { UserData } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { CourseData } from "../../context/CourseContext";

const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  const { user, isAuth } = UserData();

  const { fetchCourses } = CourseData();
  {/*
  const deleteHandler = async (id) => {
    if (confirm("Are you sure you want to delete this course")) {
      try {
        const { data } = await axios.delete(`${server}/api/course/${id}`, {
          headers: {
            token: localStorage.getItem("token"),
          },
        });

        toast.success(data.message);
        fetchCourses();
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };
  */}
  return (
    
    <div className="course-card">
      <img src={`${server}/${course.image}`} alt="" className="course-image" />
      <h3>{course.title}</h3>
<<<<<<< HEAD
      <p>Start: {new Date(course.startTime).toLocaleDateString('en-GB', { timeZone: 'UTC' })}</p>
      <p>End: {new Date(course.endTime).toLocaleDateString('en-GB', { timeZone: 'UTC' })}</p>

=======
      <p>Instructor- {course.createdBy}</p>
      <p>Duration- {course.duration} weeks</p>
>>>>>>> 4666d7328af8b62f01d462e616897f30b51daeea
      {isAuth ? (
        <>
          {user && user.role !== "admin" ? (
            <>
              {user.subscription.includes(course._id) ? (
                <button
                  onClick={() => navigate(`/course/study/${course._id}`)}
                  className="common-btn"
                >
                  Study
                </button>
              ) : (
                <button
                  onClick={() => navigate(`/course/${course._id}`)}
                  className="common-btn"
                >
                  Get Started
                </button>
              )}
            </>
          ) : (
            <button
              onClick={() => navigate(`/course/study/${course._id}`)}
              className="common-btn"
            >
              Study
            </button>
          )}
        </>
      ) : (
        <button onClick={() => navigate("/login")} className="common-btn">
          Get Started
        </button>
      )}

      <br />
      {/*
      {user && user.role === "admin" && (
        <button
          onClick={() => deleteHandler(course._id)}
          className="common-btn"
          style={{ background: "red" }}
        >
          Delete
        </button>
      )}
        */}
    </div>
  );
};

export default CourseCard;
