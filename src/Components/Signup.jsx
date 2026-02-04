import React, { useContext, useRef, useState } from "react";
import { uiContext } from "../App";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const { ui } = useContext(uiContext);

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {ui === 0 ? <Email /> : ui === 1 ? <VerifyOtp /> : <SignupForm />}

        {/* Bottom Box (Login link) */}
        <div className="mt-3 bg-white border border-gray-200 rounded-sm py-4 text-center text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-[#0095f6] font-semibold">
            Log in
          </a>
        </div>

        {/* Footer small text */}
        <p className="text-xs text-gray-400 text-center mt-4">
          By continuing, you agree to our Terms, Privacy Policy and Cookies Policy.
        </p>
      </div>
    </div>
  );
};

export default Signup;


const Email = () => {
  const { email, setEmail, setUi } = useContext(uiContext);

  const btnCLickhandler = async () => {
    try {
      await axios.post(import.meta.env.VITE_DOMAIN + "/api/otp/send-otp", { email });
      setUi(1);
      toast.success("OTP sent!");
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to send OTP");
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-sm px-8 py-10">
      <h1 className="text-3xl font-semibold text-center mb-8 tracking-tight">
        Instagram
      </h1>

      <p className="text-sm text-gray-500 text-center mb-5">
        Enter your email to get OTP verification
      </p>

      <input
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        type="email"
        placeholder="Email"
        className="w-full bg-[#fafafa] border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
      />

      <button
        onClick={btnCLickhandler}
        className="w-full mt-4 bg-[#0095f6] text-white text-sm font-semibold py-2 rounded-md hover:bg-[#1877f2] transition"
      >
        Send OTP
      </button>
    </div>
  );
};

/* ---------------- OTP Screen ---------------- */
const VerifyOtp = () => {
  const inputRef = useRef([]);
  const { email, setUi } = useContext(uiContext);
  const [otp, setOtp] = useState(Array(6).fill(""));

  const focusInput = (index) => inputRef.current[index]?.focus();

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d$/.test(value)) {
      e.target.value = "";
      return;
    }
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (index < 5) focusInput(index + 1);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      if (otp[index]) {
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        focusInput(index - 1);
      }
    }
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length < 6) {
      toast.error("Please enter 6 digit OTP");
      return;
    }

    try {
      await axios.post(import.meta.env.VITE_DOMAIN + "/api/otp/verify-otp", {
        otp: enteredOtp,
        email,
      });
      toast.success("OTP Verified!");
      setUi(2);
    } catch (error) {
      toast.error(error?.response?.data?.error || "Invalid OTP");
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-sm px-8 py-10">
      <h1 className="text-3xl font-semibold text-center mb-8 tracking-tight">
        Instagram
      </h1>

      <p className="text-sm text-gray-500 text-center mb-6">
        Enter the 6-digit code sent to <span className="font-medium">{email}</span>
      </p>

      <div className="flex justify-between gap-2">
        {[...Array(6)].map((_, index) => (
          <input
            key={index}
            ref={(el) => (inputRef.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={otp[index]}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className="w-11 h-11 text-center text-lg bg-[#fafafa] border border-gray-300 rounded-md focus:outline-none focus:border-gray-400"
          />
        ))}
      </div>

      <button
        onClick={handleVerify}
        className="w-full mt-6 bg-[#0095f6] text-white text-sm font-semibold py-2 rounded-md hover:bg-[#1877f2] transition"
      >
        Verify OTP
      </button>

      <button
        onClick={() => setUi(0)}
        className="w-full mt-3 text-sm text-gray-500 hover:text-gray-700"
      >
        Change email
      </button>
    </div>
  );
};

/* ---------------- Signup Form ---------------- */
const SignupForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mail: "",
    password: "",
    username: "",
    dateOfBirth: "",
    gender: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(import.meta.env.VITE_DOMAIN + "/api/auth/signup", formData);
      toast.success("Signup successful 🎉");
    } catch (error) {
      toast.error(error?.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-sm px-8 py-10">
      <h1 className="text-3xl font-semibold text-center mb-3 tracking-tight">
        Instagram
      </h1>

      <p className="text-sm text-gray-500 text-center mb-6">
        Sign up to see photos and videos from your friends.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            name="firstName"
            placeholder="First name"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="w-1/2 bg-[#fafafa] border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last name"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="w-1/2 bg-[#fafafa] border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
          />
        </div>

        <input
          type="email"
          name="mail"
          placeholder="Email"
          value={formData.mail}
          onChange={handleChange}
          required
          className="w-full bg-[#fafafa] border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
        />

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
          className="w-full bg-[#fafafa] border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full bg-[#fafafa] border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
        />

        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          required
          className="w-full bg-[#fafafa] border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
        />

        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
          className="w-full bg-[#fafafa] border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
        >
          <option value="">Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <button
          type="submit"
          className="w-full bg-[#0095f6] text-white text-sm font-semibold py-2 rounded-md hover:bg-[#1877f2] transition"
        >
          Sign up
        </button>
      </form>
    </div>
  );
};
