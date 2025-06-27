// src/components/AllUser.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;
const AllUser = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const mockUsers = await axios.get(`${API_URL}/api/v1/user/contact`, {
                    withCredentials: true
                });

                console.log(mockUsers.data.allUser);

                const timer = setTimeout(() => {
                    setUsers(mockUsers.data.allUser);
                    setLoading(false);
                }, 800); // Simulate network delay

                return () => clearTimeout(timer);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);


    const handleUserClick = (userId) => {
        navigate(`/chat/${userId}`);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto p-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Conversations</h2>

            <div className="space-y-3">
                {users.map((user) => (
                    <div
                        key={user.id}
                        onClick={() => handleUserClick(user.id)}
                        className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer border border-gray-100"
                    >
                        <div className="flex-shrink-0">
                            {user.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="h-12 w-12 rounded-full object-cover"
                                />
                            ) : (
                                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>

                        <div className="ml-4 flex-1 min-w-0">
                            <div className="flex justify-between items-baseline">
                                <h3 className="text-sm font-medium text-gray-900 truncate">
                                    {user.name}
                                </h3>
                                {user.lastMessageTime && (
                                    <span className="text-xs text-gray-500">
                                        {new Date(user.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                )}
                            </div>

                            <p className="text-sm text-gray-500 truncate">
                                {user.lastMessage || 'Start a new conversation'}
                            </p>
                        </div>

                        {user.unreadCount > 0 && (
                            <span className="ml-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                {user.unreadCount}
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllUser;