import axios from "axios";
import { X, Heart, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

const PostModal = ({ setUseModal, post }) => {
  const [currMedia, setCurrMedia] = useState(0);
  const [comment, setComment] = useState("");
  const [allComments, setAllComments] = useState(post.comments || []);
  const [replyInputs, setReplyInputs] = useState({});
  const [viewReplies, setViewReplies] = useState({});
  const [replyText, setReplyText] = useState("");
  const [likedComments, setLikedComments] = useState(
    Object.fromEntries(
      (post.comments || []).map((c) => [c._id, c.isLikedByMe || false])
    )
  );

  // Lock scroll
  useEffect(() => {
    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      window.scrollTo(0, scrollY);
    };
  }, []);

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_DOMAIN}/api/comments/${post._id}`,
        { text: comment },
        { withCredentials: true }
      );
      setAllComments([...allComments, res.data.data]);
      setComment("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleLike = async (commentId) => {
    const isLiked = likedComments[commentId];

    setLikedComments((prev) => ({
      ...prev,
      [commentId]: !isLiked,
    }));

    try {
      if (isLiked) {
        await axios.patch(
          `${import.meta.env.VITE_DOMAIN}/api/comments/${post._id}/${commentId}/unlike`,
          {},
          { withCredentials: true }
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_DOMAIN}/api/comments/${post._id}/${commentId}/like`,
          {},
          { withCredentials: true }
        );
      }
    } catch {
      setLikedComments((prev) => ({
        ...prev,
        [commentId]: isLiked,
      }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      {/* Modal */}
      <div className="relative flex h-[75vh] w-[75vw] max-w-6xl overflow-hidden rounded-3xl bg-white/90 shadow-2xl backdrop-blur-md">
        
        {/* Close */}
        <X
          onClick={() => setUseModal(false)}
          className="absolute right-4 top-4 z-20 cursor-pointer text-white drop-shadow-md hover:scale-110"
        />

        {/* Media */}
        <div className="relative flex w-[65%] items-center justify-center bg-black">
          {post.media.length > 1 && (
            <>
              <button
                onClick={() =>
                  setCurrMedia(
                    currMedia === 0 ? post.media.length - 1 : currMedia - 1
                  )
                }
                className="absolute left-4 z-10 rounded-full bg-black/60 px-3 py-2 text-white"
              >
                ‹
              </button>

              <button
                onClick={() =>
                  setCurrMedia(
                    currMedia === post.media.length - 1 ? 0 : currMedia + 1
                  )
                }
                className="absolute right-4 z-10 rounded-full bg-black/60 px-3 py-2 text-white"
              >
                ›
              </button>
            </>
          )}

          <img
            src={post.media[currMedia]}
            alt="post"
            className="h-full w-full object-contain"
          />
        </div>

        {/* Right panel */}
        <div className="flex w-[35%] flex-col">
          {/* Header */}
          <div className="flex items-center gap-3 border-b px-4 py-3">
            <img
              src={post.author.profilePicture}
              className="h-10 w-10 rounded-full object-cover ring-2 ring-[#dd2a7b]"
            />
            <p className="font-semibold text-sm">@{post.author.username}</p>
          </div>

          {/* Caption */}
          <div className="border-b px-4 py-2 text-sm text-gray-700">
            {post.caption}
          </div>

          {/* Comments */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
            {allComments.length === 0 ? (
              <p className="text-center text-sm text-gray-400">
                No comments yet
              </p>
            ) : (
              allComments.map((c) => (
                <div key={c._id} className="flex gap-2">
                  <img
                    src={c.author?.profilePicture}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-semibold">
                        {c.author?.username}
                      </span>{" "}
                      {c.text}
                    </p>

                    <div className="mt-1 flex items-center gap-4 text-xs text-gray-500">
                      <button
                        onClick={() => handleToggleLike(c._id)}
                        className="flex items-center gap-1"
                      >
                        <Heart
                          size={14}
                          className={
                            likedComments[c._id]
                              ? "fill-[#dd2a7b] text-[#dd2a7b]"
                              : "text-gray-400"
                          }
                        />
                        Like
                      </button>

                      <button
                        onClick={() =>
                          setReplyInputs((p) => ({
                            ...p,
                            [c._id]: !p[c._id],
                          }))
                        }
                      >
                        Reply
                      </button>
                    </div>

                    {replyInputs[c._id] && (
                      <div className="mt-2 flex gap-2">
                        <input
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="flex-1 rounded-full border px-3 py-1 text-xs"
                          placeholder="Reply..."
                        />
                        <button
                          onClick={async () => {
                            const res = await axios.post(
                              `${import.meta.env.VITE_DOMAIN}/api/comments/${post._id}/${c._id}/reply`,
                              { text: replyText },
                              { withCredentials: true }
                            );
                            setReplyText("");
                            setAllComments((prev) =>
                              prev.map((i) =>
                                i._id === c._id
                                  ? { ...i, reply: [...i.reply, res.data.data] }
                                  : i
                              )
                            );
                          }}
                          className="rounded-full bg-black px-3 py-1 text-xs text-white"
                        >
                          Post
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add comment */}
          <div className="flex gap-2 border-t px-4 py-3">
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 rounded-full border px-4 py-2 text-sm outline-none"
            />
            <button
              onClick={handleAddComment}
              disabled={!comment.trim()}
              className="rounded-full bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostModal;
