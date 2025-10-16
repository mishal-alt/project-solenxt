import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Email:", email, "Password:", password);
  };

  return (
    <div className="flex h-screen pt-25">
      {/* Left Side - Image / Branding */}
      <div className="hidden md:flex w-1/2 bg-black items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-6xl font-extrabold tracking-tight">
            SOLE<span className="text-gray-400">.NXT</span>
          </h1>
          <p className="mt-3 text-gray-400 uppercase tracking-[.3em] text-sm">
            Step Into The Future
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-white">
        <form
          onSubmit={handleLogin}
          className="w-80 md:w-96 bg-white rounded-2xl shadow-xl p-8"
        >
          <h2 className="text-3xl font-bold text-center text-black mb-8">
            Welcome Back 👟
          </h2>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-4 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-transform hover:-translate-y-1"
          >
            Login
          </button>

          <p className="text-center text-gray-500 text-sm mt-6">
            Don’t have an account?{" "}
            <a href="/signin" className="text-black font-semibold hover:underline">
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
