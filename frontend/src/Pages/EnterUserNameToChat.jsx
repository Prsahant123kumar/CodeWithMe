import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const EnterUserNameToChat = () => {
    const [platform, setPlatform] = useState('leetcode');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSearch = async () => {
        if (!username.trim()) {
            setError('Please enter a username');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:3000/api/v1/user/findUser', {
                name: username,
                platform: platform
            },{
                withCredentials: true
            }
        );

            if (response.data.success) {
                // Navigate to chat page with user data
                console.log(response.data,"inEnte")
                navigate('/chatPage', { 
                    state: {

                        Name:response.data.Name,
                        profile: response.data.user,
                        platform ,
                        messages: response.data.messages
                    } 
                });
            } else {
                setError(response.data.message || 'User not found');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to search user');
            console.error('Search error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4"
        >
            <div className="w-full max-w-md">
                <motion.div
                    initial={{ y: -20 }}
                    animate={{ y: 0 }}
                    className="bg-gray-800/70 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-gray-700"
                >
                    <div className="p-8">
                        <h1 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
                            Find Coder
                        </h1>
                        <p className="text-gray-400 text-center mb-6">
                            Search by competitive programming profile
                        </p>

                        <div className="space-y-4">
                            {/* Platform Selector */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Platform
                                </label>
                                <select
                                    value={platform}
                                    onChange={(e) => setPlatform(e.target.value)}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="leetcode">LeetCode</option>
                                    <option value="codeforces">Codeforces</option>
                                    <option value="codechef">CodeChef</option>
                                    <option value="codingNinja">Coding Ninja</option>
                                </select>
                            </div>

                            {/* Username Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder={`Enter ${platform} username`}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>

                            {/* Error Message */}
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-red-400 text-sm p-2 bg-red-900/30 rounded-lg"
                                >
                                    {error}
                                </motion.div>
                            )}

                            {/* Search Button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleSearch}
                                disabled={loading || !username}
                                className={`w-full py-2 rounded-lg font-medium mt-4 ${
                                    loading || !username
                                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                                }`}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Searching...
                                    </span>
                                ) : (
                                    'Search User'
                                )}
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default EnterUserNameToChat;