import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUserData } from "../Utils/UserSlice";

const ToggleSwitch = ({ label }) => {
  const userData = useSelector((store) => store.user);
  const [isPrivate, setIsPrivate] = useState(userData.isPrivate);
  const dispatch = useDispatch();

  function apiCaller() {
    async function toggleAccount() {
      const res = await axios.patch(
        import.meta.env.VITE_DOMAIN +
          `/api/profile/${userData._id}/privacy`,
        { isPrivate: !isPrivate },
        { withCredentials: true }
      );

      dispatch(addUserData(res.data.data));
      setIsPrivate((prev) => !prev);
    }

    toggleAccount();
  }

  return (
    <div className="flex items-center justify-between gap-4 py-2">
      {/* Label */}
      {label && (
        <span className="text-sm font-medium text-gray-800">
          {label}
        </span>
      )}

      {/* Switch */}
      <label className="relative inline-flex cursor-pointer items-center">
        <input
          type="checkbox"
          checked={isPrivate}
          onClick={apiCaller}
          readOnly
          className="peer sr-only"
        />

        {/* Track */}
        <div
          className="
            h-6 w-11 rounded-full
            bg-gray-300
            transition-all duration-300
            peer-checked:bg-gradient-to-r
            peer-checked:from-[#f58529]
            peer-checked:via-[#dd2a7b]
            peer-checked:to-[#8134af]
            shadow-inner
          "
        ></div>

        {/* Thumb */}
        <div
          className="
            absolute left-0.5 top-0.5
            h-5 w-5 rounded-full bg-white
            shadow-md transition-all duration-300
            peer-checked:translate-x-5
          "
        ></div>
      </label>
    </div>
  );
};

export default ToggleSwitch;