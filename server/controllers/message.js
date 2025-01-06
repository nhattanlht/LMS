import Conversation from "../models/Conversation.js";
import Message from "../models/message.js";
import { getReceiverSocketId, io } from "../config/socket.js";

export const sendMessage = async (req, res) => {
	try {
	  const { message } = req.body;
	  const { id: receiverId } = req.params;
	  const senderId = req.user._id;
  
	  let conversation = await Conversation.findOne({
		participants: { $all: [senderId, receiverId] },
	  });
  
	  if (!conversation) {
		conversation = await Conversation.create({
		  participants: [senderId, receiverId],
		});
	  }
  
	  const newMessage = new Message({
		senderId,
		receiverId,
		message,
		read: false, // Chưa đọc
	  });
  
	  if (newMessage) {
		conversation.messages.push(newMessage._id);
	  }
  
	  await Promise.all([conversation.save(), newMessage.save()]);
  
	  // SOCKET IO FUNCTIONALITY WILL GO HERE
	  const receiverSocketId = getReceiverSocketId(receiverId);
	  if (receiverSocketId) {
		io.to(receiverSocketId).emit("newMessage", newMessage);
	  }
  
	  res.status(201).json(newMessage);
	} catch (error) {
	  console.log("Error in sendMessage controller: ", error.message);
	  res.status(500).json({ error: "Internal server error" });
	}
};  

export const getMessages = async (req, res) => {
	try {
		const { id: userToChatId } = req.params;
		const senderId = req.user._id;

		const conversation = await Conversation.findOne({
			participants: { $all: [senderId, userToChatId] },
		}).populate("messages"); // NOT REFERENCE BUT ACTUAL MESSAGES

		if (!conversation) return res.status(200).json([]);

		const messages = conversation.messages;

		res.status(200).json(messages);
	} catch (error) {
		console.log("Error in getMessages controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const markMessagesAsRead = async (req, res) => {
	try {
	  const { conversationId } = req.params;
	  const userId = req.user._id;
  
	  const conversation = await Conversation.findById(conversationId);
	  if (!conversation) {
		return res.status(404).json({ error: "Conversation not found" });
	  }
  
	  // Cập nhật tất cả tin nhắn trong cuộc hội thoại là đã đọc
	  await Message.updateMany(
		{ _id: { $in: conversation.messages }, receiverId: userId, read: false },
		{ $set: { read: true } }
	  );
  
	  res.status(200).json({ message: "Messages marked as read" });
	} catch (error) {
	  console.log("Error in markMessagesAsRead controller: ", error.message);
	  res.status(500).json({ error: "Internal server error" });
	}
};
  

export const getConversations = async (req, res) => {
	try {
	  const userId = req.user._id;
  
	  // Tìm tất cả các cuộc hội thoại của người dùng
	  const conversations = await Conversation.find({
		participants: userId,
	  })
		.populate("participants", "name email") // Chỉ lấy thông tin cần thiết của User
		.populate("messages", "message createdAt")
		.sort({ updatedAt: -1 }); // Sắp xếp theo thời gian cập nhật gần nhất
  
	  // Trả về danh sách cuộc hội thoại
	  res.status(200).json(conversations);
	} catch (error) {
	  console.error("Error in getConversations: ", error.message);
	  res.status(500).json({ error: "Internal server error" });
	}
};