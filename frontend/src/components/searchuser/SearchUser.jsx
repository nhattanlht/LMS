import React, { useState } from "react";
import axios from "axios";
import { server } from "../../main";
import "./searchUser.css"; // Tạo file CSS cho styling

const SearchUser  = ({ onSelectUser  }) => {
  const [email, setEmail] = useState(""); // State để lưu trữ email tìm kiếm
  const [user, setUser ] = useState(null); // State để lưu trữ thông tin người dùng tìm thấy
  const [error, setError] = useState(""); // State để lưu trữ thông báo lỗi

  const handleSearch = async () => {
    try {
      const { data } = await axios.get(`${server}/api/user/search`, {
        params: { email },
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      setUser (data.user); // Cập nhật state với thông tin người dùng tìm thấy
      setError(""); // Reset thông báo lỗi
    } catch (err) {
      setError("User  not found"); // Cập nhật thông báo lỗi nếu không tìm thấy người dùng
      setUser (null); // Reset state người dùng
    }
  };

  return (
    <div className="search-user-container">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)} // Cập nhật email khi người dùng nhập
        placeholder="Enter email to search"
      />
      <button onClick={handleSearch}>Search</button>
      {error && <p className="error">{error}</p>} {/* Hiển thị thông báo lỗi nếu có */}
      {user && (
        <div className="user-result" onClick={() => onSelectUser (user._id)}>
          <p>{user.name} ({user.email})</p> {/* Hiển thị thông tin người dùng tìm thấy */}
        </div>
      )}
    </div>
  );
};

export default SearchUser ;