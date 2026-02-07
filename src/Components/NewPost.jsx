import axios from "axios";
import React, { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addPost } from "../Utils/UserSlice";
import toast from "react-hot-toast";

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

const NewPost = () => {
  const [temp, setTemp] = useState("");
  const [media, setMedia] = useState([]);
  const [enableBtn, setEnableBtn] = useState(true);

  const nav = useNavigate();
  const dispatch = useDispatch();

  async function postBtnHandler() {
    try {
      setEnableBtn(false);
      const base64Media = await Promise.all(
        media.map((item) => fileToBase64(item.item))
      );

      const res = await axios.post(
        import.meta.env.VITE_DOMAIN + "/api/posts/create",
        { caption: temp, location: "Delhi", media: base64Media },
        { withCredentials: true }
      );

      if (res.status === 201) {
        dispatch(addPost(res.data.data));
        toast.success("Post created successfully");
        nav("/profile");
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to create post");
    } finally {
      setEnableBtn(true);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#fde2e4] via-[#fbcfe8] to-[#e0e7ff]">
      {/* Glow layers */}
      <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-pink-300/30 blur-[140px]" />
      <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-purple-300/30 blur-[140px]" />

      <div className="relative z-10">
        <Navbar />

        <div className="mx-auto flex w-full max-w-[1200px] gap-6 px-4 py-6">
          {/* Sidebar */}
          <div className="hidden lg:block w-[320px]">
            <div className="sticky top-[90px] rounded-3xl bg-white/70 shadow-xl backdrop-blur-md overflow-hidden">
              <Sidebar />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="rounded-3xl bg-white/85 shadow-2xl backdrop-blur-md p-6">
              <h2 className="mb-6 text-center font-serif text-3xl font-bold tracking-wide
                             bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af]
                             bg-clip-text text-transparent">
                Create New Post
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Form */}
                <div className="space-y-5">
                  {/* Upload */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Upload Images / Videos
                    </label>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files);
                        const arr = files.map((item) => ({
                          item,
                          preview: URL.createObjectURL(item),
                        }));
                        setMedia([...media, ...arr]);
                      }}
                      className="block w-full text-sm text-gray-700 rounded-full border bg-[#FAFAFA]
                                 file:mr-4 file:py-2.5 file:px-5
                                 file:rounded-full file:border-0
                                 file:text-sm file:font-semibold
                                 file:bg-gradient-to-r file:from-[#f58529] file:via-[#dd2a7b] file:to-[#8134af]
                                 file:text-white cursor-pointer"
                    />
                  </div>

                  {/* Caption */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Caption
                    </label>
                    <input
                      type="text"
                      value={temp}
                      onChange={(e) => setTemp(e.target.value)}
                      placeholder="Write something..."
                      className="w-full rounded-full border bg-[#FAFAFA] px-5 py-2.5 text-sm outline-none
                                 focus:border-[#dd2a7b] focus:ring-2 focus:ring-[#f5c2e7]"
                    />
                  </div>

                  {/* Button */}
                  {enableBtn && (
                    <button
                      onClick={postBtnHandler}
                      className="w-full rounded-full bg-gradient-to-r
                                 from-[#f58529] via-[#dd2a7b] to-[#8134af]
                                 py-2.5 text-sm font-semibold text-white shadow-lg
                                 hover:opacity-95 hover:scale-[1.02] transition"
                    >
                      Post
                    </button>
                  )}
                </div>

                {/* Preview */}
                <div className="rounded-2xl bg-white/70 p-4 shadow-md backdrop-blur-md max-h-[65vh] overflow-y-auto">
                  <h3 className="mb-4 text-lg font-semibold text-gray-700">
                    Preview
                  </h3>

                  {media.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No media selected yet
                    </p>
                  ) : (
                    <div className="grid grid-cols-3 gap-3">
                      {media.map((item, index) => (
                        <div
                          key={index}
                          className="relative h-28 rounded-xl overflow-hidden border border-gray-300 group"
                        >
                          <img
                            src={item.preview}
                            alt={`preview-${index}`}
                            className="h-full w-full object-cover"
                          />

                          <button
                            onClick={() =>
                              setMedia(media.filter((_, i) => i !== index))
                            }
                            className="absolute top-2 right-2 rounded-full bg-red-600
                                       px-2 py-1 text-xs text-white opacity-80
                                       hover:opacity-100 transition"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPost;
