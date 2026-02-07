import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const EditPassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const nav = useNavigate();

  const handleChangePassword = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Please enter all the fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    async function change() {
      try {
        await axios.patch(
          import.meta.env.VITE_DOMAIN + "/api/auth/change-password",
          { oldPassword, newPassword },
          { withCredentials: true }
        );
        toast.success("Password Changed Successfully");
        nav("/profile");
      } catch (error) {
        toast.error(error?.response?.data?.error || "Something went wrong");
      }
    }
    change();
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#fde2e4] via-[#fbcfe8] to-[#e0e7ff] px-4">
      
      {/* Glow layers (same everywhere) */}
      <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-pink-300/30 blur-[140px]" />
      <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-purple-300/30 blur-[140px]" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md rounded-3xl bg-white/85 p-8 shadow-2xl backdrop-blur-md">
        
        {/* Heading */}
        <h2 className="mb-6 text-center font-serif text-3xl font-bold tracking-wide bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af] bg-clip-text text-transparent">
          Change Password
        </h2>

        {/* Old Password */}
        <div className="mt-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Old Password
          </label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Enter old password"
            className="w-full rounded-full border bg-[#FAFAFA] px-5 py-2.5 text-sm outline-none transition
                       focus:border-[#dd2a7b] focus:ring-2 focus:ring-[#f5c2e7]"
          />
        </div>

        {/* New Password */}
        <div className="mt-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            className="w-full rounded-full border bg-[#FAFAFA] px-5 py-2.5 text-sm outline-none transition
                       focus:border-[#dd2a7b] focus:ring-2 focus:ring-[#f5c2e7]"
          />
        </div>

        {/* Confirm Password */}
        <div className="mt-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className="w-full rounded-full border bg-[#FAFAFA] px-5 py-2.5 text-sm outline-none transition
                       focus:border-[#dd2a7b] focus:ring-2 focus:ring-[#f5c2e7]"
          />
        </div>

        {/* Buttons */}
        <div className="mt-8 flex gap-3">
          <button
            onClick={handleChangePassword}
            className="w-full rounded-full bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af]
                       py-2.5 text-sm font-semibold text-white shadow-lg transition
                       hover:opacity-95 hover:scale-[1.02]"
          >
            Update Password
          </button>

          <button
            onClick={() => nav("/profile")}
            className="w-full rounded-full border border-gray-300 bg-white/70
                       py-2.5 text-sm font-semibold text-gray-700 shadow-md transition
                       hover:bg-white hover:scale-[1.02]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPassword;
