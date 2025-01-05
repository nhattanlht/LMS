import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { server } from '../../main'; // Đảm bảo server được cấu hình đúng
import { TextField, Button, Paper, Typography, List, ListItem, ListItemText, Badge } from '@mui/material';
import './Message.css'; // Import file CSS
import io from 'socket.io-client';

const userId = localStorage.getItem('userId'); // Giả sử bạn lưu userId trong localStorage sau khi đăng nhập

if (!userId) {
  console.error('User is not logged in!');
}

const socket = io('http://localhost:5001', {
  query: { userId }, // Truyền userId thực tế vào query của Socket.IO
});

const Message = ({ user, receiverId, setReceiverId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [newChatEmail, setNewChatEmail] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSending, setIsSending] = useState(false);

  // Tạo ref để tham chiếu đến phần tử chứa tin nhắn
  const messagesEndRef = useRef(null);

  const fetchConversations = async () => {
    try {
      const { data } = await axios.get(`${server}/api/conversations`, {
        headers: { token: localStorage.getItem('token') },
      });
      setConversations(data);
      const unread = data.reduce((count, conversation) => {
        const unreadMessages = conversation.messages.filter(
          (msg) => !msg.read && msg.receiverId === user._id
        );
        return count + unreadMessages.length;
      }, 0);
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const fetchMessages = async () => {
    if (!receiverId) return;
    try {
      const { data } = await axios.get(`${server}/api/rec/${receiverId}`, {
        headers: { token: localStorage.getItem('token') },
      });
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage || !receiverId || isSending) return;
    setIsSending(true);
    try {
      await axios.post(`${server}/api/send/${receiverId}`, { message: newMessage }, {
        headers: { token: localStorage.getItem('token') },
      });
      setNewMessage('');
      fetchMessages();
      socket.emit('send_message', { receiverId, message: newMessage });
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleSelectUser = (id) => {
    setReceiverId(id);
    setShowSearch(false);
    fetchMessages();
  };

  const handleEmailChange = async (e) => {
    const email = e.target.value;
    setNewChatEmail(email);
    if (email) {
      try {
        const { data } = await axios.get(`${server}/api/user/search`, {
          headers: { token: localStorage.getItem('token') },
          params: { email },
        });
        setSearchResults(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error searching for user:', error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  useEffect(() => {
    socket.on('newMessage', (messageData) => {
      if (messageData.receiverId === user._id) {
        setMessages((prevMessages) => [...prevMessages, messageData]);
      }
    });

    fetchConversations();
    if (receiverId) fetchMessages();

    return () => {
      socket.off('newMessage');
    };
  }, [receiverId]);

  // Hàm cuộn xuống phần tử mới nhất khi có tin nhắn mới hoặc khi bắt đầu cuộc trò chuyện
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="message-container">
      <div className="sidebar">
        <Button variant="outlined" onClick={() => setShowSearch(!showSearch)} className="new-chat-btn">
          New Chat
        </Button>

        {showSearch && (
          <TextField
            value={newChatEmail}
            onChange={handleEmailChange}
            label="Search by Email"
            variant="outlined"
            fullWidth
            className="search-input"
          />
        )}

        {showSearch && (
          <List className="search-list">
            {searchResults.length === 0 ? (
              <Typography variant="body2" className="no-user-found">
                No users found or invalid search
              </Typography>
            ) : (
              searchResults.map((user) => (
                <ListItem key={user._id} button onClick={() => handleSelectUser(user._id)}>
                  <ListItemText primary={user.name || 'Unknown User'} />
                </ListItem>
              ))
            )}
          </List>
        )}

        <List className="conversation-list">
          {conversations.map((conversation) => {
            const otherUser = conversation.participants.find((p) => p._id !== user._id);
            const unreadMessages = conversation.messages.filter(
              (msg) => !msg.read && msg.receiverId === user._id
            );

            return (
              <ListItem
                key={conversation._id}
                button
                selected={receiverId === otherUser._id}
                onClick={() => {
                  handleSelectUser(otherUser._id);
                }}
              >
                <Badge color="error" badgeContent={unreadMessages.length} invisible={unreadMessages.length === 0}>
                  <ListItemText primary={otherUser.name || 'Unknown User'} />
                </Badge>
              </ListItem>
            );
          })}
        </List>
      </div>

      <div className="chat-area">
        <Paper className="messages">
          {messages.map((msg, index) => (
            <Typography key={index} className={`message ${msg.senderId === user._id ? 'sender' : 'receiver'}`}>
              {msg.message}
            </Typography>
          ))}
          {/* Thêm ref vào phần tử cuối cùng trong danh sách tin nhắn */}
          <div ref={messagesEndRef} />
        </Paper>

        <div className="message-input">
          <TextField
            variant="outlined"
            fullWidth
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <Button variant="contained" color="primary" onClick={sendMessage} disabled={isSending}>
            {isSending ? 'Sending...' : 'Send'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Message;
