import React, { useEffect, useState } from "react";
import "./noti.css"; // Import the CSS file
import axios from "axios";
import Loading from "../../components/loading/Loading";
import { MdMail } from "react-icons/md"; // Import Mail Icon from React Icons
import { FaBell } from "react-icons/fa";  // Import Bell Icon from React Icons




const Noti = () => {
    const [notifications, setNotifications] = useState([]);
    const [message, setMessage] = useState('');  
    const [selectedNotification, setSelectedNotification] = useState(null); 
    const [loading, setLoading] = useState(true); 


    console.log("Fetching notifications..."); 
    
    const getNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
    
        // Gửi yêu cầu GET với token trong header
        const response = await fetch('http://localhost:3001/api/notification/me', {
          method: 'GET',
          headers: {
            'token': token,
          },
        });
    
        // Kiểm tra mã trạng thái phản hồi
        if (response.ok) {
          const data = await response.json();
          setMessage(data.message); 
          setNotifications(data.notifications);  

        const notificationsWithRoles = data.notifications.map((notification) => ({
        ...notification,
        isSender: notification.senderId === token,
        isReceiver: notification.receiverId === token,
      }));

      const sortedNotifications = notificationsWithRoles.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
          setNotifications(sortedNotifications);
          if (!selectedNotification && sortedNotifications.length > 0) {
            setSelectedNotification(sortedNotifications[0]);
          }

        } else {
          console.error('Failed to fetch notifications:', response.status);
        }
      } catch (error) {
        console.error('Error:', error);
      }finally {
        setLoading(false); // Sau khi hoàn thành việc tải dữ liệu, cập nhật loading thành false
      }
    };
    
    const handleNotificationClick = async (notification) => {
      setSelectedNotification(notification); // Cập nhật thông báo đã chọn
      
      try {
        const response = await fetch('http://localhost:3001/api/notification/mark-as-read', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'token': localStorage.getItem('token'),
          },
          body: JSON.stringify({
            notificationId: notification._id, 
          }),
          
        });
        
        if (response.ok) {
          console.log('Notification marked as read');
          
          setNotifications((prevNotifications) =>
            prevNotifications.map((notif) =>
              notif._id === notification._id ? { ...notif, read: true } : notif
            )
          );
        } else {
          console.error('Failed to mark notification as read');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    
  
    
    useEffect(() => {
      getNotifications();
    }, []);
    
 
    return (
      <>
       {loading ? (
        <Loading />
      ) :  notifications.length === 0 ? ( 
            <div className="container">
            <h2>No notification!</h2>

      </div>
    
      ) : (
        <div className="container">
      <div className="notification-list">
        <h2>  <FaBell className="iconBell"/> Your Notifications                 
        </h2>
        {notifications.map((notification) => (
          
           <div
           key={notification._id}
           className={`notification-item ${notification.read ? 'read' : ''}`} // Thêm lớp 'read' nếu đã xem
           onClick={() => handleNotificationClick(notification)} // Khi click vào thông báo, gọi hàm đánh dấu là đã đọc
         >
        <div className="notification-title">

        <div className="notification-time">{new Date(notification.createdAt).toLocaleString()}</div>

            <div className="notification-tcontent">{notification.subject}</div>
            <div className="notification-tmessage">
            {notification.message.length > 500
              ? `${notification.message.slice(0, 100)}...` 
              : notification.message}

          </div>

            {notification.read && <div></div>}
             </div>
  
          <div className="type">
              {notification.isSender ? 'You sent. ' : 'You received. '}
          </div>
              
             </div>

        ))}
      </div>

      <div className="notification-detail">
      {selectedNotification ? (
                <>
                  
                  <div className="notification-content-box">
                    

                  <h3 className="notification-header">          
                    <MdMail className="icon" /> 
                  {selectedNotification.subject}</h3>
                  <div className="notification-time">

                    Sent at: {new Date(selectedNotification.createdAt).toLocaleString()}
                    
                  </div>
                  </div>
                  <hr ></hr>
                  <div className="notification-content-box">


                  <div className="notification-content">{selectedNotification.message}
                  </div>

                  
                  {selectedNotification.file && (
                    <a href={`http://localhost:3001/${selectedNotification.file.path}`} target="_blank" rel="noreferrer">
                      Download attachment
                    </a>
                  )}
                  </div>
                  
                 
                </>
                
                    
              ) : (
                <p>Select a notification to see the details</p>
              )}
      </div>
    </div>
      )}
     </>  
  );
};

export default Noti;