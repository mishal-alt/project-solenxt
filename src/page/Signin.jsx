// src/pages/Signup.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import bcrypt from "bcryptjs";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Signup = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user) {
      navigate("/home");
    }
  }, [navigate]);

  const loginForm = () => {
    navigate("/login");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateSignup = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = "Name is required";
    if (!form.email.includes("@")) newErrors.email = "Invalid email";
    if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(form.password)) {
      newErrors.password = "Password must include at least one uppercase letter";
    } else if (!/[a-z]/.test(form.password)) {
      newErrors.password = "Password must include at least one lowercase letter";
    } else if (!/\d/.test(form.password)) {
      newErrors.password = "Password must include at least one number";
    } else if (!/[@#$%&*]/.test(form.password)) {
      newErrors.password = "Password must include at least one special character";
    }
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateSignup();
    setError(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const existingUsers = await axios.get("http://localhost:3001/users");
        if (existingUsers.data.some((user) => user.email === form.email)) {
          setError({ email: "Email already exists" });
          return;
        }

        const hashedPassword = await bcrypt.hash(form.password, 10);
        const newUser = {
          joinDate: new Date().toISOString(),
          fullName: form.fullName,
          email: form.email,
          password: hashedPassword,
          isBlock: false,
          cart: [],
          wishlist: [],
          orders: [],
        };

        await axios.post("http://localhost:3000/user", newUser);
        localStorage.setItem("currentUser", JSON.stringify(newUser));
        toast.success("Registered successfully!");
        setError({});
        
        // ✅ Clear form only after successful registration
        setForm({ fullName: "", email: "", password: "", confirmPassword: "" });

        navigate("/");
        window.location.reload(); // refresh current page after success
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 py-20 px-6 mt-20">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-lg p-10 border border-gray-100 transition-transform transform hover:scale-[1.01] duration-300">
        <h1 className="text-4xl font-semibold text-gray-900 text-center mb-6 tracking-tight">
          Create Your Account
        </h1>
        <p className="text-center text-gray-500 mb-10 text-sm">
          Join us and explore exclusive collections.
        </p>

        <form className="space-y-6" onSubmit={handleSubmit} autoComplete="off">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none transition-all"
            />
            {error.fullName && (
              <p className="text-red-600 text-sm mt-1">{error.fullName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none transition-all"
            />
            {error.email && (
              <p className="text-red-600 text-sm mt-1">{error.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password *
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter new password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none transition-all"
            />
            {error.password && (
              <p className="text-red-600 text-sm mt-1">{error.password}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password *
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none transition-all"
            />
            {error.confirmPassword && (
              <p className="text-red-600 text-sm mt-1">{error.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-all duration-300 font-medium text-base shadow-md hover:shadow-lg"
          >
            Create Account
          </button>

          <div className="mt-6 text-center">
            <p className="text-gray-600 mb-1">Already have an account?</p>
            <button
              type="button"
              className="text-black hover:underline hover:text-gray-700 font-medium"
              onClick={loginForm}
            >
              Login Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
