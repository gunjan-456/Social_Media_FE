import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const ChatBox = () => {
  const socket = useRef();
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [text, setText] = useState("");
  const [chats, setChats] = useState([]);
  const myUserData = useSelector((store) => store.user);
  const nav = useNavigate();

  // Fetch chats
  useEffect(() => {
    async function getChats() {
      try {
        const res = await axios.get(
          import.meta.env.VITE_DOMAIN + `/api/chats/${id}`,
          { withCredentials: true }
        );
        setChats(res.data.chats);
      } catch (e) {
        toast.error("Failed to load chats");
      }
    }
    getChats();
  }, [id]);

  // Enter key handler (attach once)
  useEffect(() => {
    const fn = (e) => {
      if (e.key === "Enter") btnClickHandler();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch user profile
  useEffect(() => {
    async function getProfile() {
      try {
        const res = await axios.get(
          import.meta.env.VITE_DOMAIN + `/api/profile/${id}`,
          { withCredentials: true }
        );
        setUserData(res.data.data);
      } catch (e) {
        toast.error("Failed to load profile");
      }
    }
    getProfile();
  }, [id]);

  // Socket connection
  useEffect(() => {
    socket.current = io(import.meta.env.VITE_DOMAIN);

    socket.current.emit("join-room", {
      sender: myUserData?._id,
      receiver: id,
    });

    const handleReceiveMsg = ({ sender, receiver, text }) => {
      setChats((prev) => [...prev, { sender, receiver, text }]);
    };

    socket.current.on("receive-msg", handleReceiveMsg);

    return () => {
      socket.current.off("receive-msg", handleReceiveMsg);
      socket.current.disconnect();
    };
  }, [id, myUserData?._id]);

  function btnClickHandler() {
    if (text.trim().length === 0) {
      toast.error("Message cannot be empty");
      return;
    }

    socket.current.emit("send-msg", {
      sender: myUserData?._id,
      receiver: id,
      text,
    });

    setChats((prev) => [
      ...prev,
      { sender: myUserData?._id, receiver: id, text },
    ]);
    setText("");
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#fde2e4] via-[#fbcfe8] to-[#e0e7ff]">
      {/* Background glows */}
      <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-pink-300/30 blur-[140px]" />
      <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-purple-300/30 blur-[140px]" />

      <div className="relative z-10 flex h-screen flex-col">
        <Navbar />

        <div className="mx-auto flex w-full max-w-[1200px] flex-1 gap-6 px-4 py-6 overflow-hidden">
          {/* Sidebar wrapper (consistent look) */}
          <div className="hidden lg:block w-[320px]">
            <div className="h-full rounded-3xl bg-white/70 shadow-xl backdrop-blur-md overflow-hidden">
              <Sidebar />
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex flex-1 flex-col rounded-3xl bg-white/80 shadow-2xl backdrop-blur-md overflow-hidden">
            {/* Header */}
            <div
              onClick={() => nav("/profile/view/" + id)}
              className="flex cursor-pointer items-center gap-4 border-b border-gray-200/70 bg-white/70 px-6 py-4 backdrop-blur-md"
            >
              {userData ? (
                <>
                  <img
                    src={
                      userData.profilePicture ||
                      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                    }
                    alt="profile"
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-[#dd2a7b]"
                  />

                  <div className="leading-tight">
                    <p className="font-semibold text-gray-800">
                      {userData.firstName} {userData.lastName}
                    </p>
                    <p className="text-sm text-gray-500">@{userData.username}</p>
                  </div>
                </>
              ) : (
                <div className="flex w-full items-center gap-4">
                  <div className="h-12 w-12 animate-pulse rounded-full bg-gray-300" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 animate-pulse rounded bg-gray-300" />
                    <div className="h-3 w-1/2 animate-pulse rounded bg-gray-300" />
                  </div>
                </div>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
              {chats.map((item, index) => {
                const isSender = item.sender === myUserData?._id;

                return (
                  <div
                    key={index}
                    className={`flex ${isSender ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 text-sm shadow-md break-words
                        ${
                          isSender
                            ? "rounded-2xl rounded-br-none bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white"
                            : "rounded-2xl rounded-bl-none bg-gray-200 text-gray-800"
                        }`}
                    >
                      {item.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input */}
            <div className="flex items-center gap-3 border-t border-gray-200/70 bg-white/70 px-6 py-4 backdrop-blur-md">
              <input
                type="text"
                placeholder="Message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="flex-1 rounded-full border border-gray-200 bg-[#fafafa] px-5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#dd2a7b]"
              />
              <button
                onClick={btnClickHandler}
                className="rounded-full bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af] px-5 py-2 text-sm font-semibold text-white shadow-lg hover:opacity-95 hover:scale-[1.02] transition"
              >
                Send
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ChatBox;
