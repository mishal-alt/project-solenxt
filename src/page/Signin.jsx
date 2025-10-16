import { useState } from "react";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Signup Data:", formData);
  };

  return (
    <div className="flex h-screen mt-25">
      {/* Left Side - Centered Brand */}
      <div className="hidden md:flex w-1/2 bg-black items-center justify-center">
        <h1 className="text-6xl font-extrabold tracking-tight text-white text-center">
          SOLE<span className="text-gray-400">.NXT</span>
        </h1>
      </div>

      {/* Right Side - Signup Form */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-white">
        <form
          onSubmit={handleSubmit}
          className="w-80 md:w-96 bg-white rounded-2xl shadow-xl p-8"
        >
          <h2 className="text-3xl font-bold text-center text-black mb-8">
            Create Account 🖤
          </h2>

          <div className="mb-5">
            <label className="block text-gray-700 font-medium mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-5">
            <label className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-5">
            <label className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-2 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-transform hover:-translate-y-1"
          >
            Sign Up
          </button>

          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?{" "}
            <a href="/login" className="text-black font-semibold hover:underline">
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
