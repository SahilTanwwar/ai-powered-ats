import React, { useState } from "react";
import { ThumbsUp, MessageSquare, Share2, Send, MoreHorizontal, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export function PostCard({ post }) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);

  const handleLike = () => {
    if (liked) {
      setLikesCount(likesCount - 1);
    } else {
      setLikesCount(likesCount + 1);
    }
    setLiked(!liked);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface rounded-lg shadow-sm border border-border mb-4 overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 flex gap-3 items-start">
        <Link to={`/profile/${post.authorId}`} className="flex-shrink-0">
          <img
            src={post.authorAvatar}
            alt={post.authorName}
            className="w-12 h-12 rounded-full object-cover"
          />
        </Link>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <Link to={`/profile/${post.authorId}`} className="block group">
              <h3 className="font-semibold text-primary truncate group-hover:text-accent transition-colors flex items-center gap-1">
                {post.authorName}
                <span className="text-xs text-secondary font-normal">• 1st</span>
              </h3>
              <p className="text-xs text-secondary truncate">{post.authorHeadline}</p>
            </Link>
            <button className="text-secondary hover:text-primary p-1 rounded-full hover:bg-bg transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-1 text-xs text-secondary mt-0.5">
            <span>{post.timeAgo}</span>
            <span>•</span>
            <Globe className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-primary text-sm whitespace-pre-line">{post.content}</p>
      </div>

      {/* Image if any */}
      {post.image && (
        <div className="w-full bg-bg">
          <img src={post.image} alt="Post content" className="w-full object-cover max-h-[500px]" />
        </div>
      )}

      {/* Stats */}
      <div className="px-4 py-2 border-b border-border flex justify-between items-center text-xs text-secondary">
        <div className="flex items-center gap-1 hover:text-accent hover:underline cursor-pointer transition-colors">
          <div className="flex -space-x-1">
            <div className="w-4 h-4 rounded-full bg-accent flex items-center justify-center border border-surface z-10">
              <ThumbsUp className="w-2 h-2 text-white" />
            </div>
          </div>
          <span className="ml-1">{likesCount}</span>
        </div>
        <div className="flex gap-3 hover:text-accent cursor-pointer transition-colors">
          <span className="hover:underline">{post.comments} comments</span>
          <span>•</span>
          <span className="hover:underline">{post.shares} reposts</span>
        </div>
      </div>

      {/* Action Bar */}
      <div className="px-2 py-1 flex items-center justify-between">
        <button
          onClick={handleLike}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-md text-sm font-medium transition-colors ${
            liked ? "text-accent" : "text-secondary hover:bg-bg hover:text-primary"
          }`}
        >
          <ThumbsUp className={`w-5 h-5 ${liked ? "fill-accent" : ""}`} />
          {liked ? "Liked" : "Like"}
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-md text-sm font-medium text-secondary hover:bg-bg hover:text-primary transition-colors">
          <MessageSquare className="w-5 h-5" />
          Comment
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-md text-sm font-medium text-secondary hover:bg-bg hover:text-primary transition-colors">
          <Share2 className="w-5 h-5" />
          Repost
        </button>
        <button className="flex-1 hidden sm:flex items-center justify-center gap-2 py-3 rounded-md text-sm font-medium text-secondary hover:bg-bg hover:text-primary transition-colors">
          <Send className="w-5 h-5" />
          Send
        </button>
      </div>
    </motion.div>
  );
}
