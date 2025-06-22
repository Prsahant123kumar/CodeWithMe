import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ChatState } from '../Context/ChatProvider'; // ⛳️ use correct hook

const EnterUserName = () => {
  const API_END_POINT = "http://localhost:3000";
  const [userName, setUserName] = useState("");
  const [userList, setUserList] = useState([]);
  const navigate = useNavigate();
  const { setOtherUserId } = ChatState(); // ✅ use context hook

  const handleChange = async (e) => {
    const value = e.target.value;
    setUserName(value);

    if (value.trim().length === 0) {
      setUserList([]);
      return;
    }

    try {
      const response = await axios.get(`${API_END_POINT}/api/vi/allUser`, {
        params: { search: value }, // match backend
        headers: {
          "content-type": "application/json"
        },
      },{
                withCredentials: true
            });
      setUserList(response.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleUserClick = (user) => {
    setOtherUserId(user._id); // 👈 set for ChatPage
    navigate("/chatpage");
  };

  return (
    <div>
      <div className="box">
        <label>Enter User Name</label>
        <input
          type="text"
          value={userName}
          onChange={handleChange}
          placeholder="Search user..."
        />
      </div>

      <div className="show">
        {userList.length === 0 && userName.length > 0 && <p>No users found</p>}
        <ul>
          {userList.map((user) => (
            <li key={user._id} onClick={() => handleUserClick(user)} style={{ cursor: 'pointer' }}>
              {user.userName || user.name || user.email}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EnterUserName;
