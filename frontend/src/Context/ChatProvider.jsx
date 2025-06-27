import React, { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState([]);
  const [otherUserId, setOtherUserId] = useState(); 
  const [currentUserId, setCurrentUserId] = useState(); 

  const history = useHistory();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);
    if (userInfo?._id) setCurrentUserId(userInfo._id);
    if (!userInfo) history.push("/");
  }, [history]);

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        notification,
        setNotification,
        chats,
        setChats,
        otherUserId,
        setOtherUserId,
        currentUserId,
        setCurrentUserId
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};


export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;