import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const userData = useSelector((store) => store.user);
  const [q, setQ] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const dropdownRef = useRef(null);
  const nav = useNavigate();

  useEffect(() => {
    setSuggestions([]);
    if (!q) return;

    const intervalId = setTimeout(() => {
      async function getData() {
        const res = await axios.get(
          import.meta.env.VITE_DOMAIN +
            `/api/follow-requests/search?q=${q}`,
          { withCredentials: true }
        );
        setSuggestions(res.data.data);
      }
      getData();
    }, 1000);

    return () => clearTimeout(intervalId);
  }, [q]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="sticky top-0 z-50 h-[80px] bg-white/80 backdrop-blur-xl shadow-md">
      <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-6">

        {/* Logo */}
        <h3
          onClick={() => nav("/home")}
          className="cursor-pointer font-serif text-3xl font-bold tracking-wide bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af] bg-clip-text text-transparent"
        >
          Instagram
        </h3>

        {/* Search */}
        <div ref={dropdownRef} className="relative w-[45%]">
          <input
            onChange={(e) => setQ(e.target.value)}
            value={q}
            type="text"
            placeholder="Search"
            className="w-full rounded-full bg-[#fafafa] px-5 py-2.5 text-sm outline-none ring-1 ring-gray-200 transition focus:ring-2 focus:ring-[#dd2a7b]"
          />

          {suggestions.length > 0 && (
            <div className="absolute top-12 w-full rounded-2xl border bg-white/90 shadow-xl backdrop-blur-md">
              {suggestions.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => nav(`/profile/view/${item._id}`)}
                  className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-gray-100 transition"
                >
                  <img
                    src={
                      item.profilePicture ||
                      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                    }
                    alt="profile"
                    className="h-10 w-10 rounded-full object-cover ring-1 ring-gray-300"
                  />

                  <div className="flex flex-col">
                    <p className="text-sm font-semibold text-gray-800">
                      {item.firstName} {item.lastName}
                    </p>
                    <span className="text-xs text-gray-500">
                      @{item.username}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Section */}
        <div className="flex items-center gap-4">
          <p className="text-sm font-semibold text-gray-700">
            {userData.username}
          </p>

          <div
            onClick={() => nav("/profile")}
            className="relative cursor-pointer"
          >
            <img
              src={
                userData.profilePicture ||
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
              }
              alt="profile"
              className="h-11 w-11 rounded-full ring-2 ring-transparent hover:ring-[#dd2a7b] transition"
            />
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
