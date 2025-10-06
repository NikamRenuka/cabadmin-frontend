import caab from "../assets/caab.png";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserCog, Eye } from "lucide-react";

const API_URL =
  import.meta.env.REACT_APP_Backend_URL ||
  "https://cabadmin-backend-production.up.railway.app";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
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
      <div className="mx-4 md:ml-auto md:mr-12 bg-white/70 p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-md h-auto md:h-[500px] flex flex-col justify-center backdrop-blur-lg border border-gray-200 animate-scaleIn">
        <div className="flex justify-center mb-3">
          <UserCog size={50} className="text-gray-800" />
        </div>

        <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-6 text-gray-900 tracking-wide">
          Admin Login
        </h2>

        {error && (
          <div className="bg-red-100/90 text-red-700 p-2 rounded mb-4 text-center text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-800">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-4 py-2.5 border rounded-lg shadow-sm focus:ring focus:ring-gray-400 focus:outline-none bg-white/80 placeholder:text-gray-500"
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2.5 border rounded-lg shadow-sm focus:ring focus:ring-gray-400 focus:outline-none bg-white/80 placeholder:text-gray-500"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 px-4 rounded-lg shadow-md hover:bg-gray-800 active:scale-[0.99] transition duration-200 font-semibold tracking-wide"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;