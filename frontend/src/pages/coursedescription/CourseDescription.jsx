import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";
import { server } from "../../main";
import { UserData } from "../../context/UserContext";
import Loading from "../../components/loading/Loading";
import "./coursedescription.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faDownload } from "@fortawesome/free-solid-svg-icons";

const CourseDescription = () => {
  const [role, setRole] = useState(localStorage.getItem('userRole') || 'L'); // Lấy vai trò người dùng từ localStorage
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const { fetchCourse, course } = CourseData();

  const [resources, setResources] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Hàm xử lý tải lên tài liệu mới
  const handleFileUpload = () => {
    if (file) {
      const newItem = { id: Date.now(), name: fileName || file.name, url: URL.createObjectURL(file) };
      const updatedResources = [...resources, newItem];
      setResources(updatedResources);
      localStorage.setItem(`resources-${params.id}`, JSON.stringify(updatedResources));
      setFile(null);
      setFileName("");
      setShowUploadModal(false);
      setSuccessMessage("Tải lên thành công!");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  // Hàm xử lý lưu tài liệu sau khi chỉnh sửa
  const handleSaveEdit = () => {
    if (editingItem) {
      const updatedItem = { 
        ...editingItem, 
        name: fileName || editingItem.name, 
        url: file ? URL.createObjectURL(file) : editingItem.url
      };
      const updatedResources = resources.map(item =>
        item.id === editingItem.id ? updatedItem : item
      );
      setResources(updatedResources);
      localStorage.setItem(`resources-${params.id}`, JSON.stringify(updatedResources));
      setEditingItem(null);
      setFile(null);
      setFileName("");
      setShowEditModal(false);
      setSuccessMessage("Chỉnh sửa tài liệu thành công!");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  // Hàm xóa tài liệu
  const handleDeleteFile = (fileId) => {
    const updatedResources = resources.filter(item => item.id !== fileId);
    setResources(updatedResources);
    localStorage.setItem(`resources-${params.id}`, JSON.stringify(updatedResources));
    setShowEditModal(false); // Đóng modal sau khi xóa
  };

  // Hàm mở modal chỉnh sửa
  const handleEdit = () => {
    setShowEditModal(true);
  };

  // Hàm chọn tài liệu để chỉnh sửa
  const handleSelectFile = (item) => {
    setEditingItem(item); // Cập nhật file đang được chỉnh sửa
    setFileName(item.name); // Cập nhật tên file vào ô input
    setFile(null); // Đặt lại file để không hiển thị file cũ
  };

  useEffect(() => {
    const storedResources = localStorage.getItem(`resources-${params.id}`);
    if (storedResources) {
      setResources(JSON.parse(storedResources));
    }
    const loadCourseData = async () => {
      await fetchCourse(params.id);
      setLoading(false);
    };
    loadCourseData();
  }, [params.id, fetchCourse]);
    fetchCourse(params.id);
  }, []);

  const joinHandler = async (courseId) => {
    try {
      const token = localStorage.getItem("token");
  
      const response = await axios.post(
        `${server}/api/course/join/${courseId}`,
        {},
        {
          headers: {
            token,
          },
        }
      );
  
      console.log(response.data.message);
      toast.success("Successfully joined the course!");
      navigate(`/course/study/${course._id}`);
    } catch (error) {
      console.error("Error joining course:", error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        course && (
          <div className="course-description">
            <div className="course-title-bar">
              <h1>Title: </h1>
              <h1>{course.title}</h1>
            </div>
            <div className="course-header">
              <img
                src={`${server}/${course.image}`}
                alt="Course"
                className="course-image"
              />
              <div className="course-info">
                <p>Start: {new Date(course.startTime).toLocaleDateString("en-GB", { timeZone: "UTC" })}</p>
                <p>End: {new Date(course.endTime).toLocaleDateString("en-GB", { timeZone: "UTC" })}</p>
                <h4>Description: </h4>
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
            <div className="course-columns">
              <div className="column">
                <h3>Resources</h3>
                {role === "L" && (
                  <>
                    <div className="course-links">
                      <button
                        className="upload-btn"
                        onClick={() => setShowUploadModal(true)}
                      >
                        Upload New File
                      </button>
                      <button
                        className="edit-btn"
                        onClick={handleEdit}
                      >
                        Edit Files
                      </button>
                    </div>
                    <ul>
                      {resources.length === 0 ? (
                        <p>No file.</p>
                      ) : (
                        resources.map((item) => (
                          <li key={item.id}>
                            <a href={item.url} target="_blank" rel="noopener noreferrer">
                              {item.name}
                            </a>
                          </li>
                        ))
                      )}
                    </ul>
                  </>
                )}
                {role === "S" && (
                  <ul>
                    {resources.length === 0 ? (
                      <p>No file.</p>
                    ) : (
                      resources.map((item) => (
                        <li key={item.id}>
                          <a href={item.url} target="_blank" rel="noopener noreferrer">
                            {item.name}
                          </a>
                        </li>
                      ))
                    )}
                  </ul>
                )}
              </div>
            </div>

            {/* Modal Upload */}
            {showUploadModal && (
              <div className="modal">
                <div className="modal-content">
                  <h3>Upload File</h3>
                  <input
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    placeholder="Enter file name"
                  />
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                  <button
                    className="upload-btn"
                    onClick={handleFileUpload}
                    disabled={!fileName} // Disabled nếu chưa nhập tên file
                  >
                    Upload
                  </button>
                  <button
                    className="close-btn"
                    onClick={() => setShowUploadModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {/* Modal Edit*/}
            {showEditModal && (
              <div className="modal">
                <div className="modal-content">
                  <h3>Edit File</h3>
                  {/* Chỉ hiển thị danh sách file nếu chưa chọn file nào để chỉnh sửa */}
                  {!editingItem ? (
                    <ul>
                      {resources.map((item) => (
                        <li
                          key={item.id}
                          onClick={() => handleSelectFile(item)} // Lựa chọn file để chỉnh sửa
                          style={{ color: 'black', cursor: 'pointer' }}
                        >
                          {item.name}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    // Nếu đã chọn file, chỉ hiển thị thông tin file đang chỉnh sửa
                    <div>
                      <h4>Editing: {editingItem.name}</h4>
                      <input
                        type="text"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        placeholder="Enter new file name"
                      />
                      <input
                        type="file"
                        onChange={(e) => {
                          setFile(e.target.files[0]);
                          setFileName(e.target.files[0]?.name || ""); // Cập nhật tên file khi chọn file mới
                        }}
                      />
                      <div>
                        {file ? (
                          <span>File selected: {file.name}</span> // Hiển thị tên file đã chọn
                        ) : (
                          <span>No file</span> // Nếu không chọn file
                        )}
                      </div>
                      <button
                        className="upload-btn"
                        onClick={handleSaveEdit}
                        disabled={!file && !fileName} // Disable nếu không có file hoặc tên file
                      >
                        Save Changes
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteFile(editingItem.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                  <button
                    className="close-btn"
                    onClick={() => setShowEditModal(false)} // Đóng modal khi bấm Close
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {successMessage && <div className="success-message">{successMessage}</div>}
          </div>
        )
              {user && user.subscription.includes(course._id) ? (
                <button
                  onClick={() => navigate(`/course/study/${course._id}`)}
                  className="common-btn"
                >
                  Study
                </button>
              ) : (
                <button onClick={() => joinHandler(course._id)} className="common-btn">
                  Join Course
                </button>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default CourseDescription;
