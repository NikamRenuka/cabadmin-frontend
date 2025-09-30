import caab from "../assets/caab.png"; // ✅ make sure file extension matches your actual image

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserCog } from "lucide-react"; // ✅ import admin icon

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("https://cabadmin-backend.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      if (onLogin) onLogin(data.user);

      navigate("/dashboard");
    } catch (err) {
      setError("Server error. Please try again.");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${caab})` }}
    >
      <div className="ml-auto mr-12 bg-white/60 p-8 rounded-2xl shadow-xl w-full max-w-md h-[500px] flex flex-col justify-center backdrop-blur-lg border border-gray-300">
        
        {/* Icon above heading */}
        <div className="flex justify-center mb-3">
          <UserCog size={50} className="text-gray-800" />
        </div>

        <h2 className="text-2xl font-extrabold text-center mb-6 text-gray-900 tracking-wide">
          Admin Login
        </h2>

        {error && (
          <div className="bg-red-100/90 text-red-700 p-2 rounded mb-4 text-center text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username field */}
          <div>
            <label className="block text-sm font-medium text-gray-800">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-4 py-2.5 border rounded-lg shadow-sm focus:ring focus:ring-gray-400 focus:outline-none bg-white/70"
              placeholder="Enter your username"
              required
            />
          </div>

          {/* Password field */}
          <div>
            <label className="block text-sm font-medium text-gray-800">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2.5 border rounded-lg shadow-sm focus:ring focus:ring-gray-400 focus:outline-none bg-white/70"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-black text-white py-2.5 px-4 rounded-lg shadow-md hover:bg-gray-800 transition duration-300 font-semibold tracking-wide"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
