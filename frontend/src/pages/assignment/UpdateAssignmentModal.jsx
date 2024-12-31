import React, { useState } from "react";
import { AssignmentData } from "../../context/AssignmentContext";
import "./updateAssignmentModal.css";

const UpdateAssignmentModal = ({ assignment, onClose }) => {
  const { updateAssignment } = AssignmentData();
  const [title, setTitle] = useState(assignment.title);
  const [description, setDescription] = useState(assignment.description);
  const [startDate, setStartDate] = useState(assignment.startDate.split('T')[0]); // Chuyển đổi định dạng ngày
  const [dueDate, setDueDate] = useState(assignment.dueDate.split('T')[0]); // Chuyển đổi định dạng ngày

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedAssignment = {
      title,
      description,
      startDate,
      dueDate,
    };
    await updateAssignment(assignment._id, updatedAssignment);
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Update Assignment</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <label htmlFor="startDate">Start Date</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <label htmlFor="dueDate">Due Date</label>
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <div className="button-group">
            <button type="submit" className="common-btn">Update</button>
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateAssignmentModal;