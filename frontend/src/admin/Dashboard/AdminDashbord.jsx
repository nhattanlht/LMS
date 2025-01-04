import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../Utils/Layout";
import axios from "axios";
import { server } from "../../main";
import "./dashboard.css";

const AdminDashbord = ({ user }) => {
  const navigate = useNavigate();

  if (user && user.mainrole !== "admin") return navigate("/");

  const [stats, setStats] = useState([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [recipientType, setRecipientType] = useState("allUsers"); // Mặc định gửi cho tất cả người dùng
  const [specificRecipients, setSpecificRecipients] = useState(""); // Địa chỉ email người nhận (dành cho 'specific' recipient type)
  const [file, setFile] = useState(null); // File đính kèm nếu có

  // Fetch thống kê
  async function fetchStats() {
    try {
      const { data } = await axios.get(`${server}/api/stats`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      setStats(data.stats);
    } catch (error) {
      
    }
  }

  // Gửi thông báo
  const handleSendNotification = async () => {
    try {
      const formData = new FormData();
      formData.append("recipientType", recipientType);
      formData.append("subject", subject);
      formData.append("message", message);
      if (recipientType === "specific") {
        formData.append("specificRecipients", specificRecipients);
      }
      if (file) {
        formData.append("file", file);
      }

      const { data } = await axios.post(`${server}/api/notification`, formData, {
        headers: {
          token: localStorage.getItem("token"),
          "Content-Type": "multipart/form-data",

        },
      });

      console.log(data);
      alert("Notification sent successfully!");
    } catch (error) {
      console.log("Sending data:", {
        recipientType,
        subject,
        message,
        specificRecipients,
        file,
      });
      console.log("Error fetching stats:", error.response?.data || error.message);
      console.error("Error sending notification:", error);
      alert("Failed to send notification!");
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div>
      <Layout>
        <div className="main-content">
          <div className="box">
            <p>Total Courses</p>
            <p>{stats.totalCoures}</p>
          </div>

          <div className="box">
            <p>Total Users</p>
            <p>{stats.totalUsers}</p>
          </div>

          {/* Form gửi thông báo */}
          <div className="notification-form">
            <h3>Send Notification</h3>
            <div>
              <label>Subject:</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter notification subject"
              />
            </div>
            <div>
              <label>Message:</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your message"
              />
            </div>
            <div>
              <label>Recipient Type:</label>
              <select
                value={recipientType}
                onChange={(e) => setRecipientType(e.target.value)}
              >
                <option value="allUsers">All Users</option>
                <option value="allLecturers">All Lecturers</option>
                <option value="allStudents">All Students</option>
                <option value="specific">Specific Emails</option>
              </select>
            </div>
            {recipientType === "specific" && (
              <div>
                <label>Specific Recipients (comma separated emails):</label>
                <input
                  type="text"
                  value={specificRecipients}
                  onChange={(e) => setSpecificRecipients(e.target.value)}
                  placeholder="Enter emails"
                />
              </div>
            )}
            <div>
              <label>File (optional):</label>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>
            <button onClick={handleSendNotification}>Send Notification</button>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default AdminDashbord;
