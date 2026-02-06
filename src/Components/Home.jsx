import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import axios from "axios";
import Feed from "./PostCards";

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function getData() {
      const res = await axios.get(
        import.meta.env.VITE_DOMAIN + `/api/posts/feed`,
        { withCredentials: true }
      );
      setPosts(res.data.data);
    }
    getData();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#fde2e4] via-[#fbcfe8] to-[#e0e7ff]">

      {/* Background glow layers (same as Login for consistency) */}
      <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-pink-300/30 blur-[140px]" />
      <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-purple-300/30 blur-[140px]" />

      {/* Content */}
      <div className="relative z-10">
        <Navbar />

        <div className="mx-auto flex w-full max-w-[1200px] gap-8 px-4 py-6">
          
          {/* Feed Section */}
          <div className="flex-1">
            <div className="mx-auto w-full max-w-[630px] space-y-6">
              <Feed posts={posts} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="hidden w-[320px] lg:block">
            <div className="sticky top-[90px] rounded-2xl bg-white/80 p-4 shadow-xl backdrop-blur-md">
              <Sidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
