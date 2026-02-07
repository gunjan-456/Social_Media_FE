import React, { useRef, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { addUserData } from "../Utils/UserSlice";

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

const Profile = () => {
  const userData = useSelector((store) => store.user);
  const nav = useNavigate();
  const inputRef = useRef(null);
  const [temp, setTemp] = useState("");
  const dispatch = useDispatch();

  function onChangeHandler(e) {
    async function upload() {
      const base64pic = await fileToBase64(e.target.files[0]);
      setTemp(URL.createObjectURL(e.target.files[0]));
      const res = await axios.patch(
        import.meta.env.VITE_DOMAIN +
          `/api/profile/${userData._id}/profile-picture`,
        { profilePicture: base64pic },
        { withCredentials: true }
      );
      dispatch(addUserData(res.data.data));
    }
    upload();
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#fde2e4] via-[#fbcfe8] to-[#e0e7ff]">
      {/* Glow blobs */}
      <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-pink-300/30 blur-[140px]" />
      <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-purple-300/30 blur-[140px]" />

      <Navbar />

      <div className="relative z-10 mx-auto flex w-full max-w-[1200px] gap-6 px-4 py-6">
        {/* Sidebar */}
        <div className="hidden lg:block w-[320px]">
          <div className="sticky top-[90px] rounded-3xl bg-white/70 shadow-xl backdrop-blur-md overflow-hidden">
            <Sidebar />
          </div>
        </div>

        {/* Profile Content */}
        <div className="flex-1">
          <div className="rounded-3xl bg-white/85 shadow-2xl backdrop-blur-md p-8">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row md:items-center gap-10">
              {/* Profile Pic */}
              <input
                ref={inputRef}
                type="file"
                onChange={onChangeHandler}
                className="hidden"
              />

              <div className="flex justify-center md:w-1/4">
                <div
                  onClick={() => inputRef.current.click()}
                  className="cursor-pointer rounded-full bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af] p-[4px]"
                >
                  <img
                    className="h-[170px] w-[170px] rounded-full object-cover bg-white"
                    src={
                      temp ||
                      userData.profilePicture ||
                      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                    }
                    alt="profile"
                  />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 space-y-5">
                <p className="text-3xl font-extrabold bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af] bg-clip-text text-transparent">
                  {userData.firstName} {userData.lastName}
                </p>

                {/* Stats */}
                <div className="flex gap-10 text-gray-800">
                  <p>
                    <span className="font-bold">
                      {userData.posts.length}
                    </span>{" "}
                    posts
                  </p>
                  <p>
                    <span className="font-bold">
                      {userData.followers.length}
                    </span>{" "}
                    followers
                  </p>
                  <p>
                    <span className="font-bold">
                      {userData.following.length}
                    </span>{" "}
                    following
                  </p>
                </div>

                {/* Bio */}
                <p className="max-w-md text-sm leading-relaxed text-gray-700 italic">
                  {userData.bio || "No bio added yet"}
                </p>

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => nav("/profile/edit")}
                    className="rounded-full bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af]
                               px-5 py-2 text-sm font-semibold text-white shadow-lg
                               hover:opacity-95 hover:scale-[1.02] transition"
                  >
                    Edit Profile
                  </button>

                  <button
                    onClick={() => nav("/profile/edit/password")}
                    className="rounded-full border border-gray-300 bg-white/70
                               px-5 py-2 text-sm font-semibold text-gray-700 shadow-md
                               hover:bg-white hover:scale-[1.02] transition"
                  >
                    Change Password
                  </button>
                </div>
              </div>
            </div>

            {/* Posts Grid */}
            <div className="mt-14 grid grid-cols-3 gap-2">
              {userData.posts.map((item) => (
                <div
                  key={item._id}
                  className="group relative aspect-square overflow-hidden rounded-xl"
                >
                  <img
                    src={item.media[0]}
                    alt="post"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center gap-6
                                  bg-black/40 opacity-0 group-hover:opacity-100
                                  text-white font-semibold transition">
                    ❤ {item.likes?.length || 0}
                    💬 {item.comments?.length || 0}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
