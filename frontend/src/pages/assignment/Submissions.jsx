import React, { useState, useEffect } from "react";
import "./submissions.css";
import { TiTick } from "react-icons/ti";
import { SubmissionsData } from "../../context/SubmissionsContext";

const Submissions = ({ user, assignmentId, dueDate }) => {
  const { submissions, fetchSubmissions, submitAssignment } = SubmissionsData();
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchSubmissions(assignmentId);
  }, [assignmentId, fetchSubmissions]);

  const studentSubmission = user && user.role === "student"
    ? submissions.find(submission => submission.student && submission.student._id === user._id)
    : null;

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (window.confirm("You can only submit once and cannot edit after submission. Are you sure you want to submit?")) {
      const formData = new FormData();
      formData.append("assignmentId", assignmentId);
      formData.append("file", file);
      await submitAssignment(formData);
    }
  };

  const isLate = new Date() > new Date(dueDate);

  return (
    <div className="submissions">
      <h3>
        Submissions
        {user && user.role === "student" && (
          <span className={studentSubmission ? "submitted-status" : "not-submitted-status"}>
            {studentSubmission ? (
              <>
                Submitted <TiTick className="tick-icon" />
              </>
            ) : (
              isLate ? "Submission (Late)" : "Not Submitted"
            )}
          </span>
        )}
      </h3>
      {user && user.role === "student" ? (
        studentSubmission ? (
          <ul>
            <li key={studentSubmission._id}>
              <p>Student: {studentSubmission.student.name}</p>
              <a href={studentSubmission.fileUrl} download target="_blank" rel="noopener noreferrer">
                Download Submission
              </a>
            </li>
          </ul>
        ) : (
          !isLate && (
            <form onSubmit={handleSubmit}>
              <input type="file" onChange={handleFileChange} required />
              <button type="submit" className="common-btn">Submit Assignment</button>
            </form>
          )
        )
      ) : (
        <ul>
          {submissions.length > 0 ? (
            submissions.map((submission) => (
              <li key={submission._id}>
                <p>Student: {submission.student.name}</p>
                <a href={submission.fileUrl} download target="_blank" rel="noopener noreferrer">
                  Download Submission
                </a>
              </li>
            ))
          ) : (
            <p>No submissions</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default Submissions;