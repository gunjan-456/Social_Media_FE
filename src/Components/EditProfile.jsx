import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addUserData } from "../Utils/UserSlice";
import toast from "react-hot-toast";

const EditProfile = () => {
  const userData = useSelector((store) => store.user);

  const [firstName, setFirstName] = useState(userData.firstName || "");
  const [lastName, setLastName] = useState(userData.lastName || "");
  const [bio, setBio] = useState(userData.bio || "");

  const dispatch = useDispatch();
  const nav = useNavigate();

  const handleSave = () => {
    if (!firstName || !lastName) {
      toast.error("Please enter first and last name");
      return;
    }

    async function saveData() {
      try {
        const res = await axios.patch(
          import.meta.env.VITE_DOMAIN + `/api/profile/${userData._id}`,
          { firstName, lastName, bio },
          { withCredentials: true }
        );

        dispatch(addUserData(res.data.data));
        toast.success("Profile updated successfully");
        nav("/profile");
      } catch (error) {
        toast.error(error?.response?.data?.error || "Update failed");
      }
    }

    saveData();
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#fde2e4] via-[#fbcfe8] to-[#e0e7ff] px-4">
      
      {/* Glow layers (same everywhere) */}
      <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-pink-300/30 blur-[140px]" />
      <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-purple-300/30 blur-[140px]" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md rounded-3xl bg-white/85 p-8 shadow-2xl backdrop-blur-md space-y-6">
        
        {/* Heading */}
        <h2 className="text-center font-serif text-3xl font-bold tracking-wide bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af] bg-clip-text text-transparent">
          Edit Profile
        </h2>

        {/* First Name */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Enter first name"
            className="w-full rounded-full border bg-[#FAFAFA] px-5 py-2.5 text-sm outline-none transition
                       focus:border-[#dd2a7b] focus:ring-2 focus:ring-[#f5c2e7]"
          />
        </div>

        {/* Last Name */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Enter last name"
            className="w-full rounded-full border bg-[#FAFAFA] px-5 py-2.5 text-sm outline-none transition
                       focus:border-[#dd2a7b] focus:ring-2 focus:ring-[#f5c2e7]"
          />
        </div>

        {/* Bio */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700">
            Bio
          </label>
          <textarea
            rows="3"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Write something about yourself..."
            className="w-full rounded-2xl border bg-[#FAFAFA] px-5 py-3 text-sm outline-none resize-none transition
                       focus:border-[#dd2a7b] focus:ring-2 focus:ring-[#f5c2e7]"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSave}
            className="w-full rounded-full bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af]
                       py-2.5 text-sm font-semibold text-white shadow-lg transition
                       hover:opacity-95 hover:scale-[1.02]"
          >
            Save Changes
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

export default EditProfile;
