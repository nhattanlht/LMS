// server.js

import { Server } from 'socket.io';
import http from 'http';
import express from 'express';

import dotenv from "dotenv";
dotenv.config();

const app = express();
const server = http.createServer(app);

// Cấu hình CORS để cho phép client React kết nối
const io = new Server(server, {
  cors: {
    origin: [process.env.PORT], // URL của client
    methods: ["GET", "POST"],
  },
});

// Lưu trữ thông tin kết nối của mỗi người dùng
const userSocketMap = {}; // Map chứa socketId của người dùng

// Hàm lấy socketId của người nhận
export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId] || [];
};

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Lấy userId từ query params khi người dùng kết nối
  const userId = socket.handshake.query.userId;
  
  if (userId && userId !== 'undefined') {
    // Lưu socketId của userId vào userSocketMap
    if (!userSocketMap[userId]) {
      userSocketMap[userId] = new Set();
    }
    userSocketMap[userId].add(socket.id);
  }

  // Emit danh sách người dùng online cho tất cả các client
  io.emit('getOnlineUsers', Object.keys(userSocketMap));

  // Lắng nghe sự kiện ngắt kết nối
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);

    if (userId && userSocketMap[userId]) {
      userSocketMap[userId].delete(socket.id);

      // Xóa entry nếu không còn socketId nào cho userId
      if (userSocketMap[userId].size === 0) {
        delete userSocketMap[userId];
      }

      // Emit lại danh sách người dùng online
      io.emit('getOnlineUsers', Object.keys(userSocketMap));
    }
  });

  // Xử lý sự kiện gửi tin nhắn từ client
  socket.on('send_message', (messageData) => {
    const { receiverId, message } = messageData;
    const receiverSocketIds = getReceiverSocketId(receiverId);

    // Kiểm tra nếu người nhận có socketId
    if (receiverSocketIds.length > 0) {
      // Gửi tin nhắn đến tất cả các socketId của người nhận
      receiverSocketIds.forEach((receiverSocketId) => {
        io.to(receiverSocketId).emit('newMessage', messageData);
      });
    } else {
      console.log(`Receiver with ID ${receiverId} is not connected.`);
    }
  });
});

// Chạy server tại cổng 5001
server.listen(5001, () => {
    console.log('Socket running on port 5001');
  });

export { app, io, server };
