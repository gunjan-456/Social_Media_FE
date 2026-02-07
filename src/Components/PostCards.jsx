import { useState } from "react";
import { Heart, MessageCircle, Send, Bookmark } from "lucide-react";
import PostModal from "./PostModal";
import axios from "axios";

const Feed = ({ posts }) => {
  return (
    <div className="mx-auto mt-6 max-w-[630px] space-y-6">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
};

const PostCard = ({ post }) => {
  const [liked, setLiked] = useState(post.isLikedByMe);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [showComments, setShowComments] = useState(false);
  const [commentLikes, setCommentLikes] = useState(
    post.comments.reduce(
      (acc, c) => ({ ...acc, [c._id]: c.likes.includes(post.author._id) }),
      {}
    )
  );
  const [useModal, setUseModal] = useState(false);

  const toggleLikePost = () => {
    async function like() {
      await axios.patch(
        import.meta.env.VITE_DOMAIN + `/api/posts/${post._id}/like`,
        {},
        { withCredentials: true }
      );
      setLiked(true);
      setLikesCount((prev) => prev + 1);
    }

    async function unlike() {
      await axios.patch(
        import.meta.env.VITE_DOMAIN + `/api/posts/${post._id}/unlike`,
        {},
        { withCredentials: true }
      );
      setLiked(false);
      setLikesCount((prev) => prev - 1);
    }

    liked ? unlike() : like();
  };

  const toggleLikeComment = (commentId) => {
    setCommentLikes((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));

    const isLiked = commentLikes[commentId];

    if (isLiked) {
      axios.patch(
        import.meta.env.VITE_DOMAIN +
          `/api/comments/${post._id}/${commentId}/unlike`,
        {},
        { withCredentials: true }
      );
    } else {
      axios.post(
        import.meta.env.VITE_DOMAIN +
          `/api/comments/${post._id}/${commentId}/like`,
        {},
        { withCredentials: true }
      );
    }
  };

  return (
    <div className="rounded-2xl bg-white/90 shadow-lg backdrop-blur-md overflow-hidden">
      {/* Header */}
      <div className="flex items-center px-4 py-3">
        <img
          src={post.author.profilePicture}
          alt={post.author.username}
          className="h-10 w-10 rounded-full object-cover ring-2 ring-transparent hover:ring-[#dd2a7b] transition"
        />
        <div className="ml-3 flex-1">
          <p className="text-sm font-semibold text-gray-800">
            {post.author.username}
          </p>
          <p className="text-xs text-gray-500">{post.location}</p>
        </div>
      </div>

      {/* Media */}
      <div className="w-full bg-black">
        {post.media.length > 1 ? (
          <div className="flex snap-x overflow-x-auto">
            {post.media.map((m, i) => (
              <img
                key={i}
                src={m}
                alt="post-media"
                className="w-full snap-center object-cover"
              />
            ))}
          </div>
        ) : (
          <img
            src={post.media[0]}
            alt="post-media"
            className="w-full object-cover"
          />
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex gap-4">
          <button onClick={toggleLikePost}>
            <Heart
              className={`h-6 w-6 transition ${
                liked
                  ? "fill-[#dd2a7b] text-[#dd2a7b]"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            />
          </button>

          <button
            onClick={() => {
              setShowComments(true);
              setUseModal(true);
            }}
          >
            <MessageCircle className="h-6 w-6 text-gray-700 hover:text-gray-900" />
          </button>

          <Send className="h-6 w-6 text-gray-700 hover:text-gray-900 cursor-pointer" />
        </div>

        <Bookmark className="h-6 w-6 text-gray-700 hover:text-gray-900 cursor-pointer" />
      </div>

      {/* Likes & Caption */}
      <div className="px-4 pb-3 space-y-1">
        <p className="text-sm font-semibold">{likesCount} likes</p>

        <p className="text-sm">
          <span className="font-semibold">{post.author.username}</span>{" "}
          {post.caption}
        </p>

        {!showComments && post.commentsCount > 0 && (
          <p
            className="cursor-pointer text-xs text-gray-500"
            onClick={() => setShowComments(true)}
          >
            View all {post.commentsCount} comments
          </p>
        )}

        {showComments && (
          <div className="mt-2 space-y-3">
            {post.comments.map((c) => (
              <div key={c._id} className="flex gap-2">
                <img
                  src={c.author.profilePicture}
                  alt={c.author.username}
                  className="h-6 w-6 rounded-full object-cover"
                />

                <div className="flex-1">
                  <p className="flex items-center justify-between text-sm">
                    <span>
                      <span className="font-semibold">
                        {c.author.username}
                      </span>{" "}
                      {c.text}
                    </span>

                    <Heart
                      className={`h-4 w-4 cursor-pointer ${
                        commentLikes[c._id]
                          ? "fill-[#dd2a7b] text-[#dd2a7b]"
                          : "text-gray-400"
                      }`}
                      onClick={() => toggleLikeComment(c._id)}
                    />
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="mt-1 text-xs uppercase text-gray-400">
          {new Date(post.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </p>
      </div>

      {useModal && <PostModal post={post} setUseModal={setUseModal} />}
    </div>
  );
};

export default Feed;
