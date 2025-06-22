import React, { useState } from "react";
import axios from "axios";
import { FiEye, FiEyeOff, FiMail, FiLock } from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";
import { userStore } from "../store/UserStore";
import LoadingSpinner from "../components/LoadingSpinner";

const SignUp = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("http://localhost:3000/api/v1/user/signup", form);
      setMessage(res.data.message);
      userStore.getState().setUser(res.data.user);
      userStore.getState().setIsAuthenticate(false);
      userStore.getState().setIsCheckingAuth(false);
      navigate("/VerifyEmail");
    } catch (err) {
      setMessage(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 to-purple-100 px-4">
      <div className="min-w-[400px] max-w-md w-full bg-white p-8 rounded-2xl shadow-lg transition-all duration-200">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Create Account</h2>

        {message && (
          <div className="mb-4 text-center text-blue-600 font-medium text-sm">{message}</div>
        )}

        <form onSubmit={handleSignup} className="space-y-5">
          {/* Email input */}
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password input with toggle */}
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition flex justify-center items-center gap-2"
          >
            {loading ? (
              <>
                <LoadingSpinner className="!text-white" />
                Signing up...
              </>
            ) : (
              "Sign Up"
            )}
          </button>

          {/* Login link */}
          <div className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
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

export default SignUp;