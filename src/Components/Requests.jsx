import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import axios from "axios";
import toast from "react-hot-toast";

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_DOMAIN}/api/follow-requests`,
          { withCredentials: true }
        );
        setRequests(res.data.data);
      } catch {
        toast.error("Failed to fetch requests");
      }
    };

    getData();
  }, []);

  const handleReview = async (requestId, status) => {
    setLoadingId(requestId);

    try {
      await axios.patch(
        `${import.meta.env.VITE_DOMAIN}/api/follow-requests/review/${requestId}/${status}`,
        {},
        { withCredentials: true }
      );

      setRequests((prev) =>
        prev.map((req) =>
          req._id === requestId
            ? { ...req, reviewStatus: status }
            : req
        )
      );

      toast.success(
        status === "accepted"
          ? "Request Accepted"
          : "Request Rejected"
      );
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fde2e4] via-[#fbcfe8] to-[#e0e7ff]">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <div className="flex-1 px-6 py-10 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-8">
            Follow Requests
          </h2>

          {requests.length === 0 ? (
            <div className="text-center text-gray-500 mt-20">
              No follow requests
            </div>
          ) : (
            <div className="space-y-6">
              {requests.map((item) => {
                const user = item.fromUserId;
                const isReviewed = item.reviewStatus;

                return (
                  <div
                    key={item._id}
                    className="flex items-center justify-between bg-white/80 backdrop-blur-md rounded-2xl p-5 shadow-lg hover:shadow-xl transition"
                  >
                    {/* User Info */}
                    <div className="flex items-center gap-4">
                      <img
                        src={
                          user.profilePicture ||
                          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                        }
                        alt="profile"
                        className="w-14 h-14 rounded-full object-cover ring-2 ring-pink-400"
                      />
                      <div>
                        <p className="font-semibold text-gray-800">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-gray-500">
                          @{user.username}
                        </p>
                      </div>
                    </div>

                    {/* Buttons */}
                    {!isReviewed ? (
                      <div className="flex gap-3">
                        <button
                          disabled={loadingId === item._id}
                          onClick={() =>
                            handleReview(item._id, "accepted")
                          }
                          className="px-4 py-1.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:opacity-90"
                        >
                          Accept
                        </button>

                        <button
                          disabled={loadingId === item._id}
                          onClick={() =>
                            handleReview(item._id, "rejected")
                          }
                          className="px-4 py-1.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-red-500 to-pink-500 text-white hover:opacity-90"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span
                        className={`text-sm font-semibold px-4 py-1 rounded-full
                        ${
                          isReviewed === "accepted"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {isReviewed === "accepted"
                          ? "Accepted"
                          : "Rejected"}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Requests;
