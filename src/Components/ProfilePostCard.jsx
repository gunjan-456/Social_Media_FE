import React from "react";

const ProfilePostCard = ({ caption, media, location, likes, comments }) => {
  return (
    <div className="group relative aspect-square overflow-hidden rounded-xl cursor-pointer">
      
      {/* Image */}
      <img
        src={media?.[0]}
        alt={caption || "post"}
        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
      />

      {/* Hover Overlay */}
      <div
        className="absolute inset-0 flex items-center justify-center gap-6
                   bg-black/40 opacity-0 group-hover:opacity-100
                   text-white font-semibold transition"
      >
        <div className="flex items-center gap-1">
          <span className="text-lg">❤</span>
          <span>{likes?.length || 0}</span>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-lg">💬</span>
          <span>{comments?.length || 0}</span>
        </div>
      </div>

      {/* Optional caption hint (bottom fade) */}
      {caption && (
        <div
          className="pointer-events-none absolute bottom-0 left-0 w-full
                     bg-gradient-to-t from-black/70 to-transparent
                     px-3 py-2 text-xs text-white opacity-0
                     group-hover:opacity-100 transition"
        >
          {caption.length > 40 ? caption.slice(0, 40) + "…" : caption}
        </div>
      )}
    </div>
  );
};

export default ProfilePostCard;
