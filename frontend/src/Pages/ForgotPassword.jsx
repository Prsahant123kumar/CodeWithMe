import React, { useState } from "react";
import axios from "axios";
import { FiMail } from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "" });

  const handleChange = (e) => {
    setEmail(e.target.value);
    setErrors({ ...errors, email: "" });
  };

  const validateEmail = () => {
    if (!email.trim()) {
      setErrors({ email: "Email is required" });
      return false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors({ email: "Invalid email format" });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validateEmail()) return;

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:3000/api/v1/user/forgot-password", { email });
      setMessage(res.data.message);
      // Optionally navigate to another page after successful submission
      // navigate("/reset-password-instructions");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to send reset instructions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-green-100 to-blue-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Forgot Password</h2>
        
        <p className="text-gray-600 mb-6 text-center">
          Enter your email address and we'll send you instructions to reset your password.
        </p>

        {message && (
          <div className={`mb-4 text-center text-sm font-medium ${
            message.includes("Failed") ? "text-red-500" : "text-blue-600"
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email input */}
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.email
                  ? "border-red-500 focus:ring-red-300"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {errors.email && <p className="text-sm text-red-500 mt-1 ml-1">{errors.email}</p>}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          {/* Back to login link */}
          <div className="text-center text-sm text-gray-600 mt-4">
            Remember your password?{" "}
            <Link 
              to="/login" 
              className="text-blue-600 font-medium hover:underline"
            >
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;