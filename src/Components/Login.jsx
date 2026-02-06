import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import validator from "validator";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { addUserData } from "../Utils/UserSlice";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();
  const dispatch = useDispatch();

  const btnCLickHandler = () => {
    const isMail = validator.isEmail(username);

    if (!isMail && (username.length > 15 || username.length < 2)) {
      toast.error(
        "Username should be atleast 2 characters and maximum 15 characters"
      );
      return;
    }

    if (password.length < 8) {
      toast.error("Password should be atleast 8 characters");
      return;
    }

    async function login() {
      try {
        const res = await axios.post(
          import.meta.env.VITE_DOMAIN + "/api/auth/signin",
          { [isMail ? "mail" : "username"]: username, password },
          { withCredentials: true }
        );

        dispatch(addUserData(res.data.data));
        nav("/home");
      } catch (error) {
        setUsername("");
        setPassword("");
        toast.error(error.response?.data?.error || "Login failed");
      }
    }

    login();
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#fde2e4] via-[#fbcfe8] to-[#e0e7ff]">

      {/* Soft radial glow (magic layer) */}
      <div className="absolute -top-32 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-pink-300/30 blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-purple-300/30 blur-[120px]" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm rounded-2xl border border-gray-200 bg-white/90 px-10 py-9 shadow-2xl backdrop-blur-md">
        
        {/* Instagram Logo */}
        <h1 className="mb-9 text-center font-serif text-4xl font-bold tracking-wide bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af] bg-clip-text text-transparent">
          Instagram
        </h1>

        {/* Username */}
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Phone number, username, or email"
          className="mb-4 w-full rounded-full border border-gray-300 bg-[#FAFAFA] px-5 py-2.5 text-sm outline-none transition focus:border-[#dd2a7b] focus:ring-2 focus:ring-[#f5c2e7]"
        />

        {/* Password */}
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          className="mb-5 w-full rounded-full border border-gray-300 bg-[#FAFAFA] px-5 py-2.5 text-sm outline-none transition focus:border-[#dd2a7b] focus:ring-2 focus:ring-[#f5c2e7]"
        />

        {/* Login Button */}
        <button
          onClick={btnCLickHandler}
          className="w-full rounded-full bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af] py-2.5 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.03] hover:opacity-95"
        >
          Log in
        </button>

        {/* OR Divider */}
        <div className="my-7 flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-300"></div>
          <span className="text-xs font-semibold text-gray-400">OR</span>
          <div className="h-px flex-1 bg-gray-300"></div>
        </div>

        {/* Signup */}
        <p className="text-center text-sm text-gray-700">
          Don’t have an account?{" "}
          <span
            onClick={() => nav("/signup")}
            className="cursor-pointer font-semibold text-[#dd2a7b] hover:underline"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
