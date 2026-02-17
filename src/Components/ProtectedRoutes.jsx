import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import { addUserData } from "../Utils/UserSlice";

const ProtectedRoutes = () => {
  const userSliceData = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_DOMAIN}/api/auth/get-user-data`,
          { withCredentials: true }
        );

        if (res?.data?.data) {
          dispatch(addUserData(res.data.data));
        }
      } catch {
        // 🔥 No unused variable error now
        // silently fail (user not logged in)
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, [dispatch]);

  // Instagram Style Loader
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fde2e4] via-[#fbcfe8] to-[#e0e7ff]">
        <div className="bg-white/80 backdrop-blur-md p-10 rounded-3xl shadow-2xl text-center">
          <h1 className="text-4xl font-serif bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af] bg-clip-text text-transparent">
            Instagram
          </h1>

          <div className="mt-6 flex justify-center">
            <div className="h-10 w-10 border-4 border-gray-200 border-t-[#dd2a7b] rounded-full animate-spin"></div>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            Loading your account...
          </p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!userSliceData?.username) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
