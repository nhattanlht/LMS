import React, { useState } from "react";
import "./submissions.css";
import { TiTick } from "react-icons/ti";
import { AssignmentData } from "../../context/AssignmentContext";

const Submissions = ({ user, assignment }) => {
  const { submitAssignment } = AssignmentData();
  const [file, setFile] = useState(null);

  const studentSubmission = user && user.role === "student"
    ? assignment.submissions.find(submission => submission.student && submission.student._id === user._id)
    : null;

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (window.confirm("You can only submit once and cannot edit after submission. Are you sure you want to submit?")) {
      const formData = new FormData();
      formData.append("assignmentId", assignment._id);
      formData.append("file", file);
      await submitAssignment(formData);
    }
  };

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
              "Not Submitted"
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
          <form onSubmit={handleSubmit}>
            <input type="file" onChange={handleFileChange} required />
            <button type="submit" className="common-btn">Submit Assignment</button>
          </form>
        )
      ) : (
        <ul>
          {assignment.submissions.map((submission) => (
            submission.student && (
              <li key={submission._id}>
                <p>Student: {submission.student.name}</p>
                <a href={submission.fileUrl} download target="_blank" rel="noopener noreferrer">
                  Download Submission
                </a>
              </li>
            )
          ))}
        </ul>
      )}
    </div>
  );
};

export default Submissions;