import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import axios from "axios";
import ConvCard from "./ConvCard";

const Chats = () => {
  const [conv, setConv] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getConversations() {
      try {
        const res = await axios.get(
          import.meta.env.VITE_DOMAIN + `/api/chats`,
          { withCredentials: true }
        );
        setConv(res.data.data);
      } catch (err) {
        console.error("Error fetching conversations:", err);
      } finally {
        setLoading(false);
      }
    }
    getConversations();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#fde2e4] via-[#fbcfe8] to-[#e0e7ff]">
      {/* Background glows (same system) */}
      <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-pink-300/30 blur-[140px]" />
      <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-purple-300/30 blur-[140px]" />

      <div className="relative z-10">
        <Navbar />

        <div className="mx-auto flex w-full max-w-[1200px] gap-6 px-4 py-6">
          {/* Sidebar (Desktop only like IG) */}
          <div className="hidden lg:block w-[320px]">
            <div className="sticky top-[90px] h-[calc(100vh-120px)] rounded-3xl bg-white/70 shadow-xl backdrop-blur-md overflow-hidden">
              <Sidebar />
            </div>
          </div>

          {/* Main */}
          <div className="flex-1">
            <div className="rounded-3xl bg-white/80 shadow-2xl backdrop-blur-md overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-200/70 px-6 py-5 bg-white/70">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Recent Chats
                  </h1>
                  <p className="text-sm text-gray-500">
                    Your latest conversations
                  </p>
                </div>

                {/* Small badge */}
                <div className="rounded-full bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af] px-4 py-1.5 text-xs font-semibold text-white shadow-md">
                  Inbox
                </div>
              </div>

              {/* List */}
              <div className="divide-y divide-gray-200/60">
                {loading ? (
                  <div className="space-y-4 p-6">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 animate-pulse"
                      >
                        <div className="h-12 w-12 rounded-full bg-gray-300" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-3/4 rounded bg-gray-300" />
                          <div className="h-3 w-1/2 rounded bg-gray-200" />
                        </div>
                        <div className="hidden sm:block h-3 w-16 rounded bg-gray-200" />
                      </div>
                    ))}
                  </div>
                ) : conv.length > 0 ? (
                  conv.map((item, index) => (
                    <div key={index} className="hover:bg-white/60 transition">
                      <ConvCard data={item} />
                    </div>
                  ))
                ) : (
                  <div className="py-16 text-center">
                    <p className="text-gray-700 font-semibold">
                      No conversations yet
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Start chatting and your conversations will appear here.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Sidebar hint */}
            <div className="lg:hidden mt-4 rounded-2xl bg-white/70 shadow-lg backdrop-blur-md p-4 text-sm text-gray-600">
              Tip: Open a profile and start a chat to see it here.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chats;
