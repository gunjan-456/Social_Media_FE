import React, { useContext, useRef, useState } from "react";
import { uiContext } from "../App";
import axios from "axios";
import toast from "react-hot-toast";

const Signup = () => {
  const { ui } = useContext(uiContext);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#fde2e4] via-[#fbcfe8] to-[#e0e7ff] px-4">

      
      <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-pink-300/30 blur-[140px]" />
      <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-purple-300/30 blur-[140px]" />

      <div className="relative z-10 w-full max-w-sm">
        {ui === 0 ? <Email /> : ui === 1 ? <VerifyOtp /> : <SignupForm />}

        {/* Bottom Box */}
        <div className="mt-4 rounded-2xl bg-white/80 py-4 text-center text-sm shadow-lg backdrop-blur-md">
          Already have an account?{" "}
          <a href="/login" className="font-semibold text-[#dd2a7b] hover:underline">
            Log in
          </a>
        </div>

        <p className="mt-4 text-center text-xs text-gray-500">
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
    <div className="rounded-2xl bg-white/90 px-8 py-10 shadow-2xl backdrop-blur-md">
      <h1 className="mb-6 text-center font-serif text-4xl font-bold tracking-wide bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af] bg-clip-text text-transparent">
        Instagram
      </h1>

      <p className="mb-5 text-center text-sm text-gray-600">
        Enter your email to get OTP verification
      </p>

      <input
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        type="email"
        placeholder="Email"
        className="w-full rounded-full border border-gray-300 bg-[#FAFAFA] px-5 py-2.5 text-sm outline-none focus:border-[#dd2a7b] focus:ring-2 focus:ring-[#f5c2e7]"
      />

      <button
        onClick={btnCLickhandler}
        className="mt-5 w-full rounded-full bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af] py-2.5 text-sm font-semibold text-white shadow-md hover:opacity-95"
      >
        Send OTP
      </button>
    </div>
  );
};



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
    if (e.key === "Backspace" && index > 0 && !otp[index]) {
      focusInput(index - 1);
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
    <div className="rounded-2xl bg-white/90 px-8 py-10 shadow-2xl backdrop-blur-md">
      <h1 className="mb-6 text-center font-serif text-4xl font-bold tracking-wide bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af] bg-clip-text text-transparent">
        Instagram
      </h1>

      <p className="mb-6 text-center text-sm text-gray-600">
        Enter the 6-digit code sent to <span className="font-medium">{email}</span>
      </p>

      <div className="flex justify-between gap-2">
        {[...Array(6)].map((_, index) => (
          <input
            key={index}
            ref={(el) => (inputRef.current[index] = el)}
            maxLength={1}
            value={otp[index]}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className="h-11 w-11 rounded-xl border border-gray-300 bg-[#FAFAFA] text-center text-lg outline-none focus:border-[#dd2a7b] focus:ring-2 focus:ring-[#f5c2e7]"
          />
        ))}
      </div>

      <button
        onClick={handleVerify}
        className="mt-6 w-full rounded-full bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af] py-2.5 text-sm font-semibold text-white shadow-md hover:opacity-95"
      >
        Verify OTP
      </button>

      <button
        onClick={() => setUi(0)}
        className="mt-3 w-full text-sm text-gray-500 hover:text-gray-700"
      >
        Change email
      </button>
    </div>
  );
};



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

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

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
    <div className="rounded-2xl bg-white/90 px-8 py-10 shadow-2xl backdrop-blur-md">
      <h1 className="mb-3 text-center font-serif text-4xl font-bold tracking-wide bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af] bg-clip-text text-transparent">
        Instagram
      </h1>

      <p className="mb-6 text-center text-sm text-gray-600">
        Sign up to see photos and videos from your friends.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-2">
          <input
            name="firstName"
            placeholder="First name"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="w-1/2 rounded-full border bg-[#FAFAFA] px-4 py-2 text-sm outline-none focus:border-[#dd2a7b] focus:ring-2 focus:ring-[#f5c2e7]"
          />
          <input
            name="lastName"
            placeholder="Last name"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="w-1/2 rounded-full border bg-[#FAFAFA] px-4 py-2 text-sm outline-none focus:border-[#dd2a7b] focus:ring-2 focus:ring-[#f5c2e7]"
          />
        </div>

        {["mail", "username", "password", "dateOfBirth"].map((field) => (
          <input
            key={field}
            type={field === "password" ? "password" : field === "dateOfBirth" ? "date" : "text"}
            name={field}
            placeholder={field}
            value={formData[field]}
            onChange={handleChange}
            required
            className="w-full rounded-full border bg-[#FAFAFA] px-4 py-2 text-sm outline-none focus:border-[#dd2a7b] focus:ring-2 focus:ring-[#f5c2e7]"
          />
        ))}

        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
          className="w-full rounded-full border bg-[#FAFAFA] px-4 py-2 text-sm outline-none focus:border-[#dd2a7b] focus:ring-2 focus:ring-[#f5c2e7]"
        >
          <option value="">Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <button
          type="submit"
          className="w-full rounded-full bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af] py-2.5 text-sm font-semibold text-white shadow-md hover:opacity-95"
        >
          Sign up
        </button>
      </form>
    </div>
  );
};
