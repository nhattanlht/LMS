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

  async function fetchStats() {
    try {
      const { data } = await axios.get(`${server}/api/stats`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      setStats(data.stats);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchStats();
  }, []);
  return (
  <div>
    <Layout>
      <div className="dashboard-main-content">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <div className="dashboard-stats">
          <div className="dashboard-box">
            <p className="stat-title">Total Courses</p>
            <p className="stat-value">{stats.totalCourses}</p>
          </div>
          <div className="dashboard-box">
            <p className="stat-title">Total Users</p>
            <p className="stat-value">{stats.totalUsers}</p>
          </div>
        </div>
      </div>
    </Layout>
  </div>
);
};

export default AdminDashbord;
