import React, { useState } from "react";
import axios from "axios";
import { FiShield } from "react-icons/fi";
import { userStore } from "../store/UserStore";
import LoadingSpinner from "../components/LoadingSpinner";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const { user, setUser, setIsAuthenticate, setIsCheckingAuth } = userStore();

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    if (!code.trim()) {
      setError("Verification code is required");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/api/v1/user/verify-email", {
        verificationCode: code,
        email: user?.email // Include the email from store
      });

      // setMessage(res.data.message);
      // setUser(res.data.user);
      setIsAuthenticate(false);
      setIsCheckingAuth(false);
      navigate("/login"); // Redirect to protected route
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 to-purple-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Verify Your Email
        </h2>

        {message && (
          <div className="text-center text-green-600 font-semibold mb-4">{message}</div>
        )}
        {error && (
          <div className="text-center text-red-600 font-semibold mb-4">{error}</div>
        )}

        <form onSubmit={handleVerify} className="space-y-5">
          <div className="relative">
            <FiShield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Enter verification code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition flex justify-center items-center gap-2"
          >
            {loading ? (
              <>
                <LoadingSpinner className="!text-white" />
                Verifying...
              </>
            ) : (
              "Verify Email"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;