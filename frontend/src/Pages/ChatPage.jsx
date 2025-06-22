import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiSend, FiArrowLeft } from 'react-icons/fi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { io } from 'socket.io-client';

const ChatPage = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const messagesEndRef = useRef(null);
    const socket = useRef(null);
    const userStorage = JSON.parse(localStorage.getItem("user-storage"));
    const currentUserId = userStorage?.state?.user?._id;
    const { platform, username } = useParams();

    // Initialize socket connection and setup user
    useEffect(() => {
        socket.current = io("http://localhost:3000", {
            transports: ["websocket"],
            withCredentials: true
        });

        // Setup current user with socket
        socket.current.emit("setup", currentUserId);

        // Handle incoming messages
        socket.current.on("message received", (newMessage) => {
            setMessages(prev => [...prev, newMessage]);
        });

        // Handle connection errors
        socket.current.on("connect_error", (err) => {
            console.error("Socket connection error:", err);
        });

        return () => {
            socket.current.disconnect();
        };
    }, [currentUserId]);

    // Scroll to bottom when messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Fetch messages when component mounts or profile changes
    useEffect(() => {
        const fetchMessages = async (receiverId) => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `http://localhost:3000/api/v1/message/messages/${receiverId}`,
                    { withCredentials: true }
                );

                let fetchedMessages = [];

                if (response.data && Array.isArray(response.data.messages)) {
                    fetchedMessages = response.data.messages;
                } else if (response.data && response.data[0]?.messages) {
                    fetchedMessages = response.data[0].messages;
                } else if (Array.isArray(response.data)) {
                    fetchedMessages = response.data;
                }

                setMessages(fetchedMessages || []);
            } catch (err) {
                setError('Failed to load messages');
                console.error('Fetch messages error:', err);
            } finally {
                setLoading(false);
            }
        };

        if (state?.profile?.authId) {
            fetchMessages(state.profile.authId);
        } else if (platform && username) {
            fetchProfileAndMessages();
        } else {
            navigate('/EnterUserNameToChat');
        }
    }, [state, navigate, platform, username]);

    const fetchProfileAndMessages = async () => {
        try {
            setLoading(true);
            const profileResponse = await axios.get(
                `http://localhost:3000/api/v1/profile/${platform}/${username}`,
                { withCredentials: true }
            );

            if (profileResponse.data.success && profileResponse.data.profile) {
                await fetchMessages(profileResponse.data.profile.authId);
            }
        } catch (err) {
            setError('Failed to load chat');
            console.error('Fetch error:', err);
            navigate('/EnterUserNameToChat');
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !state?.profile?.authId) return;

        // Generate a client-side temporary ID with a prefix
        const tempId = `client-${Date.now()}`;

        const tempMessage = {
            _id: tempId,
            senderId: currentUserId,
            receiverId: state.profile.authId,
            message: newMessage,
            createdAt: new Date().toISOString(),
            isTemp: true
        };

        try {
            setLoading(true);
            setMessages(prev => [...prev, tempMessage]);
            setNewMessage('');

            const response = await axios.post(
                'http://localhost:3000/api/v1/message/send',
                {
                    receiverId: state.profile.authId,
                    message: newMessage
                },
                { withCredentials: true }
            );

            const sentMessage = response.data;

            // Replace the temporary message with the server's version
            setMessages(prev => prev.map(msg =>
                msg._id === tempId ? sentMessage : msg
            ));

            // Emit the message to the server
            socket.current.emit("new message", {
                senderId: currentUserId,
                receiverId: state.profile.authId,
                message: newMessage
            });
        } catch (err) {
            setError('Failed to send message');
            console.error('Send message error:', err);
            // Remove the temporary message on error
            setMessages(prev => prev.filter(msg => msg._id !== tempId));
        } finally {
            setLoading(false);
        }
    };

    if (!state?.profile && (!platform || !username)) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <p className="text-gray-600">Redirecting to user search...</p>
            </div>
        );
    }

    const displayProfile = state?.profile || {
        username: username,
        [platform]: username
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col h-screen bg-gray-50"
        >
            {/* Header */}
            <div className="bg-white p-4 shadow-sm border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="mr-4 p-2 rounded-full hover:bg-gray-100 text-gray-600"
                    >
                        <FiArrowLeft className="h-5 w-5" />
                    </button>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                        {displayProfile.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="ml-3">
                        <h2 className="font-semibold text-gray-800">{displayProfile.username || 'Unknown User'}</h2>
                        <p className="text-xs text-gray-500">
                            {platform || state?.platform}: {displayProfile[platform || state?.platform]}
                        </p>
                    </div>
                </div>
                <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
                    <BsThreeDotsVertical className="h-5 w-5" />
                </button>
            </div>

            {/* Message area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {loading && messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full">
                        <div className="animate-pulse text-gray-500">Loading messages...</div>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <div className="text-center">
                            <div className="text-xl mb-2">💬</div>
                            <p>No messages yet</p>
                            <p className="text-sm">Start the conversation!</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {messages.map((message) => {
                            const isSender = message.senderId === currentUserId;
                            return (
                                <motion.div
                                    key={message._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-xs md:max-w-md rounded-2xl px-4 py-2 ${isSender
                                                ? 'bg-blue-500 text-white rounded-br-none'
                                                : 'bg-gray-200 text-gray-800 rounded-bl-none'
                                            }`}
                                    >
                                        <p className="text-sm">{message.message}</p>
                                        <p className={`text-xs mt-1 text-right ${isSender ? 'text-blue-100' : 'text-gray-500'
                                            }`}>
                                            {new Date(message.createdAt).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Input area */}
            <div className="bg-white p-4 border-t border-gray-200">
                {error && (
                    <p className="text-red-500 text-sm mb-2 text-center">{error}</p>
                )}
                <div className="flex items-center bg-gray-100 rounded-full px-4">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                            }
                        }}
                        placeholder="Type a message..."
                        className="flex-1 bg-transparent py-2 outline-none text-gray-700 placeholder-gray-400"
                        disabled={loading}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={loading || !newMessage.trim()}
                        className={`ml-2 p-2 rounded-full ${loading || !newMessage.trim()
                                ? 'text-gray-400'
                                : 'text-blue-500 hover:text-blue-600'
                            }`}
                    >
                        <FiSend className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default ChatPage;