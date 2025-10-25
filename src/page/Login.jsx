// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';

const LoginForm = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  // Redirect if already logged in
  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    const admin = localStorage.getItem("adminUser");
    if (user) navigate("/");
    if (admin) navigate("/admin/dashboard"); // <-- redirect admin if already logged in
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateLogin = () => {
    const newErrors = {};
    if (!form.email.trim() || !form.email.includes("@")) {
      newErrors.email = "Invalid email";
    }
    if (form.password.length < 8) newErrors.password = "Invalid password";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateLogin();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    try {
      const response = await axios.get("http://localhost:3001/users");
      const users = response.data;

      // Find user by email & password (plain text)
      const user = users.find(
        u => u.email === form.email && u.password === form.password
      );

      if (!user) {
        setErrors({ general: "Incorrect email or password" });
        toast.error("Incorrect email or password");
        return;
      }

      // ✅ Blocked user check
      if (user.isBlock) {
        setErrors({ general: "Your account has been blocked. Please contact support." });
        toast.error("Your account has been blocked. Please contact support.");
        return;
      }

      // ✅ Admin login: store adminUser in localStorage
      if (user.isAdmin) {
        localStorage.setItem("adminUser", JSON.stringify(user));
        toast.success("Admin login successful");
        navigate("/admin/dashboard");
      } else {
        // Normal user login
        localStorage.setItem("currentUser", JSON.stringify(user));
        toast.success("Login successful!");
        navigate("/");
      }

      // Notify other tabs
      window.dispatchEvent(new Event("storage"));
      window.location.reload(); // Refresh UI
    } catch (err) {
      console.error(err);
      setErrors({ general: "Something went wrong. Please try again." });
    }
  };

  const signupForm = () => navigate("/signin");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 py-20 px-6 mt-20">
      <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl w-full max-w-lg p-10 border border-gray-100 transition-transform transform hover:scale-[1.01] duration-300">
        <h1 className="text-4xl font-semibold text-gray-900 text-center mb-6 tracking-tight">
          Welcome Back
        </h1>
        <p className="text-center text-gray-500 mb-10 text-sm">
          Log in to access your account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none transition-all"
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password *
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none transition-all"
            />
            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
          </div>

          {errors.general && (
            <div className="p-3 bg-red-50 border border-red-200 rounded">
              <p className="text-sm text-red-600 text-center">{errors.general}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-all duration-300 font-medium text-base shadow-md hover:shadow-lg"
          >
            Log In
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 mb-1">Don't have an account?</p>
          <button
            type="button"
            onClick={signupForm}
            className="text-black hover:underline hover:text-gray-700 font-medium"
          >
            Create One Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
