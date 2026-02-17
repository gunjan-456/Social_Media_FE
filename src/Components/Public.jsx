import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { addUserData } from "../Utils/UserSlice";

const Public = ({ data }) => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const myData = useSelector((store) => store.user);

  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(
    data?.followers?.length || 0
  );
  const [loading, setLoading] = useState(false);

  const {
    profilePicture,
    firstName,
    lastName,
    username,
    bio,
    posts = [],
    following = [],
  } = data || {};

 
  useEffect(() => {
    if (myData?.following && userId) {
      setIsFollowing(myData.following.includes(userId));
    }
  }, [myData?.following, userId]);

  const handleFollowToggle = async () => {
    if (loading) return;
    setLoading(true);

    try {
      let res;

      if (isFollowing) {
        res = await axios.patch(
          `${import.meta.env.VITE_DOMAIN}/api/follow-requests/unfollow/${userId}`,
          {},
          { withCredentials: true }
        );

        setIsFollowing(false);
        setFollowersCount((prev) => prev - 1);
      } else {
        res = await axios.post(
          `${import.meta.env.VITE_DOMAIN}/api/follow-requests/${userId}`,
          {},
          { withCredentials: true }
        );

        setIsFollowing(true);
        setFollowersCount((prev) => prev + 1);
      }

      dispatch(addUserData(res.data.data));
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fde2e4] via-[#fbcfe8] to-[#e0e7ff]">
      <div className="max-w-5xl mx-auto px-4 py-12">

      
        <div className="flex flex-col sm:flex-row gap-10 items-center">

          {/* Profile Picture */}
          <img
            src={
              profilePicture ||
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
            }
            alt="profile"
            className="w-36 h-36 rounded-full object-cover ring-4 ring-pink-400 shadow-xl"
          />

          {/* Info Section */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <h2 className="text-3xl font-extrabold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                {firstName} {lastName}
              </h2>

              <span className="text-gray-500 text-lg">@{username}</span>

              <button
                disabled={loading}
                onClick={handleFollowToggle}
                className={`px-5 py-1.5 rounded-lg text-sm font-semibold transition
                ${
                  isFollowing
                    ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    : "bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:opacity-90"
                }`}
              >
                {loading
                  ? "Loading..."
                  : isFollowing
                  ? "Following"
                  : "Follow"}
              </button>

              <button
                onClick={() => navigate("/chat/" + userId)}
                className="px-5 py-1.5 rounded-lg text-sm font-semibold bg-gray-200 hover:bg-gray-300"
              >
                Message
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 text-gray-700">
              <p>
                <span className="font-bold text-gray-900">
                  {posts.length}
                </span>{" "}
                posts
              </p>
              <p>
                <span className="font-bold text-gray-900">
                  {followersCount}
                </span>{" "}
                followers
              </p>
              <p>
                <span className="font-bold text-gray-900">
                  {following.length}
                </span>{" "}
                following
              </p>
            </div>

            {/* Bio */}
            {bio && (
              <p className="text-gray-800 max-w-lg leading-relaxed">
                {bio}
              </p>
            )}
          </div>
        </div>

        {/* Posts Grid */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-14">
            {posts.map((item) => (
              <div
                key={item._id}
                className="relative group rounded-xl overflow-hidden shadow-lg"
              >
                <img
                  src={item.media?.[0]}
                  alt="post"
                  className="h-[280px] w-full object-cover transition duration-500 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-6 text-white font-semibold text-lg transition">
                  <span>❤ {item.likes?.length || 0}</span>
                  <span>💬 {item.comments?.length || 0}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-24 text-center text-gray-500">
            <p className="text-lg font-medium">No posts yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Public;
