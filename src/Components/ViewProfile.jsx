import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import PrivateAccount from "./PrivateAccount";
import Public from "./Public";
import axios from "axios";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

const ViewProfile = () => {
  const { userId } = useParams();

  const [userData, setUserData] = useState(null);
  const [isPrivate, setIsPrivate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProfile = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `${import.meta.env.VITE_DOMAIN}/api/profile/${userId}`,
          { withCredentials: true }
        );

        setUserData(res.data.data);
        setIsPrivate(res.data.data.isPrivate);
      } catch (error) {
        toast.error(
          error?.response?.data?.error || "Unable to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      getProfile();
    }
  }, [userId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fde2e4] via-[#fbcfe8] to-[#e0e7ff]">

      <Navbar />

      <div className="flex">
        <Sidebar />

        <div className="flex-1 px-6 py-10 max-w-6xl mx-auto">

          {loading && (
            <div className="flex justify-center items-center h-96">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-pink-400 border-t-transparent"></div>
            </div>
          )}

          {!loading && userData && (
            isPrivate ? (
              <PrivateAccount data={userData} setData={setUserData} />
            ) : (
              <Public data={userData} />
            )
          )}

          {!loading && !userData && (
            <div className="text-center text-gray-500 mt-20">
              Profile not found
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
