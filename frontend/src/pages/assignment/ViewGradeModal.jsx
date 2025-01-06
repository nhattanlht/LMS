import React, { useEffect, useState } from "react";
import { SubmissionsData } from "../../context/SubmissionsContext";
import { AssignmentData } from "../../context/AssignmentContext";
import "./viewGradeModal.css";

const ViewGradeModal = ({ courseId, user, onClose }) => {
  const { fetchSubmissions, getSubmissionDetails } = SubmissionsData();
  const { fetchStudentAssignments } = AssignmentData();
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    const fetchAllGrades = async () => {
      const assignments = await fetchStudentAssignments(courseId);
      const allGrades = [];

      for (const assignment of assignments) {
        const submissions = await fetchSubmissions(assignment._id);
        const userSubmission = submissions.find(sub => sub.student._id === user._id);

        if (userSubmission) {
          console.log(`User Submission ID: ${userSubmission._id}`); // Log user submission ID
          const submissionDetails = await getSubmissionDetails(userSubmission._id);
          // console.log(`Submission Details: ${JSON.stringify(submissionDetails)}`); // Log submission details
          allGrades.push({
            assignmentTitle: assignment.title,
            grade: submissionDetails.grade || "Not graded",
            comment: submissionDetails.comment || "No comment"
          });
        } else {
          allGrades.push({
            assignmentTitle: assignment.title,
            grade: "Not graded",
            comment: "No comment"
          });
        }
      }

      setGrades(allGrades);
    };

    fetchAllGrades();
  }, [courseId, fetchStudentAssignments, fetchSubmissions, getSubmissionDetails]);

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Your Grades</h2>
        <table>
          <thead>
            <tr>
              <th>Assignment</th>
              <th>Grade</th>
              <th>Comment</th>
            </tr>
          </thead>
          <tbody>
            {grades.map((grade, index) => (
              <tr key={index}>
                <td>{grade.assignmentTitle}</td>
                <td>{grade.grade}</td>
                <td>{grade.comment}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="button-group">
          <button type="button" className="cancel-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ViewGradeModal;