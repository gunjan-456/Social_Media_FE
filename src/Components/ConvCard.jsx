import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ConvCard = ({ data }) => {
  const myData = useSelector((store) => store.user);

  const [dataToBeDisplayed] = useState(
    myData._id === data.sender._id ? data.receiver : data.sender
  );

  const nav = useNavigate();

  return (
    <div
      onClick={() => {
        nav("/chat/" + dataToBeDisplayed._id);
      }}
      className="group flex items-center gap-4 px-6 py-4 cursor-pointer transition-all
                 hover:bg-white/60 backdrop-blur-md"
    >
      {/* Profile Image */}
      <div className="relative">
        <img
          src={
            dataToBeDisplayed.profilePicture ||
            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
          }
          alt={dataToBeDisplayed.firstName}
          className="h-12 w-12 rounded-full object-cover ring-2 ring-transparent
                     group-hover:ring-[#dd2a7b] transition"
        />
      </div>

      {/* Chat Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 truncate">
          <p className="font-semibold text-gray-800 truncate">
            {dataToBeDisplayed.firstName} {dataToBeDisplayed.lastName}
          </p>
          <span className="text-sm text-gray-400 truncate">
            @{dataToBeDisplayed.username}
          </span>
        </div>

        <p className="mt-0.5 text-sm text-gray-600 truncate">
          {data.lastMsg || "No messages yet"}
        </p>
      </div>

      {/* Subtle indicator */}
      <div className="hidden sm:flex items-center">
        <span className="h-2 w-2 rounded-full bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af] opacity-0 group-hover:opacity-100 transition"></span>
      </div>
    </div>
  );
};

export default ConvCard;
