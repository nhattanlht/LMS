import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";
import { server } from "../../main";
import Loading from "../../components/loading/Loading";
import "./coursestudy.css";
import {
  faEdit,
  faTrash,
  faDownload,
  faPencilAlt,
  faEye,
  faBell,
  faPlus,
  faComment,
  faStickyNote,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AddAssignmentModal from "../assignment/AddAssignmentModal";
import { AssignmentData } from "../../context/AssignmentContext";
import EnterGradeModal from "../assignment/EnterGradeModal";
import ViewGradeModal from "../assignment/ViewGradeModal";

const CourseStudy = ({ user }) => {
  // const [role, setRole] = useState("A");
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const { fetchCourse, course } = CourseData();
  const [resources, setResources] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditResourceModal, setShowEditResourceModal] = useState(false);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [editResource, setEditResource] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [showAddAssignmentModal, setShowAddAssignmentModal] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const { assignments, fetchInstructorAssignments, fetchStudentAssignments } =
    AssignmentData();
  const [selectedAssignment, setSelectedAssignment] = useState("");
  const [showViewGradeModal, setShowViewGradeModal] = useState(false);
  const courseId = course._id;

  const handleSaveResourceEdit = () => {
    const updatedResources = resources.map((item) =>
      item.id === editResource.id ? editResource : item
    );
    setResources(updatedResources);
    localStorage.setItem(
      `resources-${params.id}`,
      JSON.stringify(updatedResources)
    );
    setShowEditResourceModal(false);
  };

  const handleUploadFile = () => {
    if (!file) {
      setSuccessMessage("Please select a file.");
      return;
    }
    const newFile = {
      id: Date.now(),
      name: fileName,
      url: URL.createObjectURL(file),
    };
    const updatedResources = [...resources, newFile];
    setResources(updatedResources);
    localStorage.setItem(
      `resources-${params.id}`,
      JSON.stringify(updatedResources)
    );
    setShowUploadModal(false);
    setSuccessMessage("File uploaded successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleDeleteResource = (resourceId) => {
    const updatedResources = resources.filter((item) => item.id !== resourceId);
    setResources(updatedResources);
    localStorage.setItem(
      `resources-${params.id}`,
      JSON.stringify(updatedResources)
    );
  };

  const handleEditResource = (resource) => {
    setEditResource(resource); // Set resource to edit
    setShowEditResourceModal(true); // Open the edit resource modal
  };

  const handleGradeClick = () => {
    setShowGradeModal(true);
  };

  const handleCloseGradeModal = () => {
    setShowGradeModal(false);
  };

  const handleAssignmentChange = (e) => {
    setSelectedAssignment(e.target.value);
  };

  const handleViewGradeClick = () => {
    setShowViewGradeModal(true);
  };

  const handleCloseViewGradeModal = () => {
    setShowViewGradeModal(false);
  };

  useEffect(() => {
    /*
    const token = localStorage.getItem('token');
    
    if (token) {
      fetch('/api/user/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      .then(response => response.json())
      .then(data => {
        setUserRole(data.role);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching user info: ", error);
        setLoading(false);
      });
    }
    localStorage.setItem('role', data.role);
    */

    const storedResources = localStorage.getItem(`resources-${params.id}`);
    if (storedResources) {
      setResources(JSON.parse(storedResources));
    }

    const loadCourseData = async () => {
      try {
        await fetchCourse(params.id);
        if (user.role === "lecturer") {
          await fetchInstructorAssignments(params.id);
        } else if (user.role === "student") {
          await fetchStudentAssignments(params.id);
        }
      } catch (error) {
        console.error("Error loading course data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCourseData();
  }, [
    params.id,
    fetchCourse,
    fetchInstructorAssignments,
    fetchStudentAssignments,
    user.role,
  ]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        course && (
          <div className="course-description">
            <div className="course-title-bar">
              <h1>{course.title}</h1>
            </div>
            <div className="course-header">
              <img src={course.image} alt="Course" className="course-image" />

              <div className="course-info">
                <p>
                  Start:{" "}
                  {new Date(course.startTime).toLocaleDateString("en-GB", {
                    timeZone: "UTC",
                  })}
                </p>
                <p>
                  End:{" "}
                  {new Date(course.endTime).toLocaleDateString("en-GB", {
                    timeZone: "UTC",
                  })}
                </p>
                <p>{course.description}</p>
                <h4>Lecturer: </h4>
                {course.lecturers && course.lecturers.length > 0 ? (
                  <ul>
                    {course.lecturers.map((lecturer, index) => (
                      <li key={index}>{lecturer}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No lecturer information available</p>
                )}
              </div>
            </div>
            {/*Nhập điểm, Gửi thông báo */}
            {user.role === "lecturer" && (
              <div className="course-button">
                <div className="course-links">
                  <button onClick={handleGradeClick} className="edit-btn">
                    <FontAwesomeIcon icon={faPencilAlt} /> <p>Enter Grade</p>
                  </button>

                  <button className="edit-btn">
                    <FontAwesomeIcon icon={faBell} /> <p>Send Notification</p>
                  </button>
                </div>
              </div>
            )}
            {showGradeModal && (
              <EnterGradeModal
                courseId={courseId} // Truyền courseId vào modal
                assignments={assignments} // Truyền assignments vào modal
                selectedAssignment={selectedAssignment} // Truyền assignment được chọn vào modal
                onAssignmentChange={handleAssignmentChange} // Truyền hàm xử lý thay đổi assignment vào modal
                onClose={handleCloseGradeModal}
              />
            )}
            {/*Xem điểm */}
            {user.role === "student" && (
              <div className="course-button">
                <div className="course-links">
                  <button className="edit-btn" onClick={handleViewGradeClick}>
                    <FontAwesomeIcon icon={faEye} className="white-icon" />{" "}
                    <p>View Grade</p>
                  </button>
                </div>
              </div>
            )}

            {showViewGradeModal && (
              <ViewGradeModal
                courseId={courseId}
                user={user}
                onClose={handleCloseViewGradeModal}
              />
            )}

            <div className="container">
              <div className="content">
                <div className="course-columns">
                  {/*Forum*/}
                  <div className="col">
                    <div className="info">
                      <Link to={`/course/study/${params.id}/forums`}>
                        <FontAwesomeIcon icon={faComment} /> Discussion Forum{" "}
                      </Link>
                    </div>
                  </div>
                  {/* Resources Column */}

                  <div className="col">
                    <h3>Resources</h3>
                    <hr></hr>
                    {user.role === "lecturer" && (
                      <div className="course-links">
                        <button
                          className="upload-btn"
                          onClick={() => setShowUploadModal(true)}
                        >
                          <FontAwesomeIcon
                            icon={faPlus}
                            className="white-icon"
                          />{" "}
                          <p>Upload New File</p>
                        </button>
                      </div>
                    )}
                    <ul>
                      {resources.length === 0 ? (
                        <p>No file.</p>
                      ) : (
                        resources.map((item) => (
                          <li key={item.id} className="file-item">
                            <div className="file-item-container">
                              {user.role === "lecturer" && (
                                <div className="file-actions">
                                  <button
                                    className="edit-btn"
                                    onClick={() => handleEditResource(item)}
                                  >
                                    <FontAwesomeIcon
                                      icon={faEdit}
                                      className="icon"
                                    >
                                      onClick={() => handleEditResource(item)}
                                    </FontAwesomeIcon>
                                  </button>

                                  <button
                                    className="delete-btn"
                                    onClick={() =>
                                      handleDeleteResource(item.id)
                                    }
                                  >
                                    <FontAwesomeIcon
                                      icon={faTrash}
                                      className="icon"
                                    />
                                  </button>
                                  <button className="download-btn">
                                    <a href={item.url}>
                                      <FontAwesomeIcon
                                        icon={faDownload}
                                        className="icon"
                                      />
                                    </a>
                                  </button>

                                  <p>{item.name}</p>
                                </div>
                              )}
                            </div>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                  {/* Assignment Column */}
                  <div className="col">
                    <h3>Assignment</h3>
                    <hr></hr>
                    {user.role === "lecturer" && (
                      <div className="course-links">
                        <button
                          className="upload-btn"
                          onClick={() => setShowAddAssignmentModal(true)} // Hiển thị modal khi nhấn nút
                        >
                          <FontAwesomeIcon
                            icon={faPlus}
                            className="white-icon"
                          />{" "}
                          <p>Add New Assignment</p>
                        </button>
                      </div>
                    )}
                    <ul>
                      {assignments.map((assignment) => (
                        <li key={assignment._id}>
                          <Link to={`/assignments/details/${assignment._id}`}>
                            <h4>{assignment.title}</h4>
                          </Link>
                          <p>{assignment.description}</p>
                          <p>
                            Due Date:{" "}
                            {new Date(assignment.dueDate).toLocaleString()}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Modal Add Assignment */}
                  {showAddAssignmentModal && (
                    <AddAssignmentModal
                      courseId={params.id}
                      onClose={() => setShowAddAssignmentModal(false)}
                    />
                  )}

                  {/* Test Column */}
                  <div className="col">
                    <h3>Test</h3>
                    <hr></hr>

                    {user.role === "lecturer" && (
                      <div className="course-links">
                        <button className="upload-btn">
                          <FontAwesomeIcon
                            icon={faPlus}
                            className="white-icon"
                          />{" "}
                          <p>Add New Test</p>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="sidebar">
                <h2>Event</h2>
                <hr></hr>
                <ul></ul>
              </div>

              {/* Modal Upload File */}
              {showUploadModal && (
                <div className="modal">
                  <div className="modal-content">
                    <h3>Upload File</h3>
                    <div className="form-group">
                      <label>File Name:</label>
                      <input
                        type="text"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>File:</label>
                      <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                      />
                    </div>
                    <button className="close-btn" onClick={handleUploadFile}>
                      Upload
                    </button>
                    <button
                      className="close-btn"
                      onClick={() => setShowUploadModal(false)}
                    >
                      Cancel
                    </button>
                    {successMessage && <p>{successMessage}</p>}
                  </div>
                </div>
              )}

              {/* Modal Edit Resource */}
              {showEditResourceModal && editResource && (
                <div className="modal">
                  <div className="modal-content">
                    <h3>Edit Resource</h3>
                    <div className="form-group">
                      <label>File Name:</label>
                      <input
                        type="text"
                        value={editResource.name}
                        onChange={(e) =>
                          setEditResource({
                            ...editResource,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <button onClick={handleSaveResourceEdit}>Save</button>
                    <button onClick={() => setShowEditResourceModal(false)}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      )}
    </>
  );
};

export default CourseStudy;
