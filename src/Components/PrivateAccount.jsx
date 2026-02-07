import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const PrivateAccount = ({ data, setData }) => {
  const { userId } = useParams();
  const userSliceData = useSelector((store) => store.user);
  const [isFollowing, setIsFollowing] = useState(
    userSliceData.following.some((item) => item === userId)
  );
  const [isReqSent, setIsReqSent] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    async function check() {
      const res = await axios.get(
        import.meta.env.VITE_DOMAIN +
          `/api/follow-requests/check/${userId}`,
        { withCredentials: true }
      );
      setIsReqSent(res.data.flag);
    }

    if (!isFollowing) {
      check();
    }
  }, [isFollowing, userId]);

  const {
    profilePicture,
    firstName,
    lastName,
    username,
    bio,
    posts,
    followers,
    following,
  } = data;

  function followBtnHandler() {
    async function unfollow() {
      const res = await axios.patch(
        import.meta.env.VITE_DOMAIN +
          `/api/follow-requests/unfollow/${userId}`,
        {},
        { withCredentials: true }
      );
      setData(res.data.toUserData);
      setIsFollowing(false);
    }

    async function cancelReq() {
      await axios.delete(
        import.meta.env.VITE_DOMAIN + `/api/follow-requests/${userId}`,
        { withCredentials: true }
      );
      setIsReqSent(false);
    }

    async function follow() {
      await axios.post(
        import.meta.env.VITE_DOMAIN + `/api/follow-requests/${userId}`,
        {},
        { withCredentials: true }
      );
      setIsReqSent(true);
    }

    if (isFollowing) unfollow();
    else isReqSent ? cancelReq() : follow();
  }

  return (
    <div className="relative rounded-3xl bg-white/80 p-6 shadow-2xl backdrop-blur-md">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        {/* Avatar */}
        <div className="relative">
          <div className="rounded-full bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af] p-[3px]">
            <img
              src={
                profilePicture ||
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
              }
              alt={`${firstName} ${lastName}`}
              className="h-32 w-32 rounded-full object-cover bg-white"
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1">
          {/* Name + Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-2xl font-bold text-gray-900">
              {firstName} {lastName}
              <span className="ml-2 text-lg font-normal text-gray-500">
                @{username}
              </span>
            </p>

            <button
              onClick={followBtnHandler}
              className={`rounded-full px-5 py-1.5 text-sm font-semibold transition
                ${
                  isFollowing
                    ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    : isReqSent
                    ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                    : "bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white hover:opacity-95"
                }`}
            >
              {isFollowing ? "Unfollow" : isReqSent ? "Pending" : "Follow"}
            </button>

            <button
              onClick={() => nav("/chat/" + userId)}
              className="rounded-full border border-gray-300 bg-white/70 px-5 py-1.5
                         text-sm font-semibold text-gray-700 shadow-sm transition
                         hover:bg-white hover:scale-[1.02]"
            >
              Message
            </button>
          </div>

          {/* Stats */}
          <div className="mt-4 flex gap-6 text-gray-800">
            <p>
              <span className="font-semibold">{posts?.length}</span>{" "}
              <span className="text-gray-500">Posts</span>
            </p>
            <p>
              <span className="font-semibold">{followers?.length}</span>{" "}
              <span className="text-gray-500">Followers</span>
            </p>
            <p>
              <span className="font-semibold">{following?.length}</span>{" "}
              <span className="text-gray-500">Following</span>
            </p>
          </div>

          {/* Bio */}
          {bio && (
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-700">
              {bio}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrivateAccount;
