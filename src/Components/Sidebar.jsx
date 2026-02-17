import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { clearData } from "../Utils/UserSlice";
import ToggleSwitch from "./PrivacyBtn";
import toast from "react-hot-toast";

const Sidebar = () => {
  const [expanded, setExpanded] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_DOMAIN}/api/auth/logout`,
        {},
        { withCredentials: true }
      );

      dispatch(clearData());
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.error || "Logout failed. Try again."
      );
    }
  };

  const baseLinkStyle =
    "flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200";

  const activeStyle =
    "bg-white/70 shadow-md backdrop-blur-md";

  return (
    <div
      className={`min-h-screen sticky top-0 z-40 
      bg-gradient-to-b from-[#fde2e4] via-[#fbcfe8] to-[#e0e7ff]
      backdrop-blur-md shadow-xl
      transition-all duration-300
      ${expanded ? "w-64 p-5" : "w-20 p-4"}`}
    >
      {/* Toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="mb-6 text-gray-700 hover:text-pink-600 transition text-xl"
      >
        ☰
      </button>

      {/* Navigation */}
      <nav className="flex flex-col gap-3 text-gray-800 font-medium">

        <NavLink
          to="/"
          className={({ isActive }) =>
            `${baseLinkStyle} ${
              isActive ? activeStyle : "hover:bg-white/60"
            }`
          }
        >
          🏠 {expanded && <span>Home</span>}
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `${baseLinkStyle} ${
              isActive ? activeStyle : "hover:bg-white/60"
            }`
          }
        >
          👤 {expanded && <span>Profile</span>}
        </NavLink>

        <NavLink
          to="/chats"
          className={({ isActive }) =>
            `${baseLinkStyle} ${
              isActive ? activeStyle : "hover:bg-white/60"
            }`
          }
        >
          💬 {expanded && <span>Chats</span>}
        </NavLink>

        <NavLink
          to="/add"
          className={({ isActive }) =>
            `${baseLinkStyle} ${
              isActive ? activeStyle : "hover:bg-white/60"
            }`
          }
        >
          ➕ {expanded && <span>New Post</span>}
        </NavLink>

        <NavLink
          to="/review-requests"
          className={({ isActive }) =>
            `${baseLinkStyle} ${
              isActive ? activeStyle : "hover:bg-white/60"
            }`
          }
        >
          👥 {expanded && <span>Requests</span>}
        </NavLink>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-white/40">
            <ToggleSwitch label="Private Account" />
          </div>
        )}
      </nav>

      {/* Logout */}
      {expanded && (
        <div className="mt-8">
          <button
            onClick={logout}
            className="w-full py-2.5 rounded-xl font-semibold text-white shadow-lg
            bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500
            hover:opacity-90 active:scale-95 transition"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
