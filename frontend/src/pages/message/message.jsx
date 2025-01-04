import React, { useEffect, useState } from "react"; // Import useState và useEffect
import axios from "axios";
import { server } from "../../main";
import { TextField, Button, Paper, Typography, IconButton } from "@mui/material"; // Import các component từ MUI
import SearchUser  from "../../components/searchuser/SearchUser"; // Import component tìm kiếm
import SearchIcon from '@mui/icons-material/Search'; // Import icon tìm kiếm

const Message = ({ user, receiverId, setReceiverId }) => {
  const [messages, setMessages] = useState([]); // State để lưu trữ tin nhắn
  const [newMessage, setNewMessage] = useState(""); // State để lưu trữ tin nhắn mới
  const [showSearch, setShowSearch] = useState(false); // State để hiển thị tìm kiếm

  // Hàm để lấy tin nhắn
  const fetchMessages = async () => {
    if (!receiverId) return; // Nếu không có receiverId, không thực hiện gì
    try {
      const { data } = await axios.get(`${server}/api/rec/${receiverId}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      setMessages(data); // Cập nhật danh sách tin nhắn
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Hàm gửi tin nhắn
  const sendMessage = async () => {
    if (!newMessage || !receiverId) return; // Kiểm tra nếu không có tin nhắn hoặc receiverId

    try {
      await axios.post(`${server}/api/send/${receiverId}`, { message: newMessage }, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      setNewMessage(""); // Reset ô nhập tin nhắn
      fetchMessages(); // Cập nhật danh sách tin nhắn sau khi gửi
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Hàm để chọn người nhận
  const handleSelectUser  = (id) => {
    setReceiverId(id); // Cập nhật receiverId
    setShowSearch(false); // Ẩn tìm kiếm
    fetchMessages(); // Tải lại tin nhắn cho người nhận mới
  };

  useEffect(() => {
    fetchMessages(); // Gọi hàm lấy tin nhắn khi receiverId thay đổi
  }, [receiverId]);

  return (
    <div style={{ padding: '20px' }}>
      <IconButton onClick={() => setShowSearch(!showSearch)}>
        <SearchIcon />
      </IconButton>
      {showSearch && <SearchUser  onSelectUser ={handleSelectUser } />} {/* Hiển thị component tìm kiếm */}
      <Paper style={{ padding: '20px', maxHeight: '400px', overflowY: 'auto' }}>
        {messages.map((msg, index) => (
          <Typography key={index} variant="body1" style={{ textAlign: msg.senderId === user._id ? 'right' : 'left' }}>
            {msg.message}
          </Typography>
        ))}
      </Paper>
      <div style={{ display: 'flex', marginTop: '10px' }}>
        <TextField
          variant="outlined"
          fullWidth
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <Button variant="contained" color="primary" onClick={sendMessage} style={{ marginLeft: '10px' }}>
          Send
        </Button>
      </div>
    </div>
  );
};

export default Message;