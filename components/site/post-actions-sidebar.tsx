"use client";

import { useState, useEffect } from "react";
import { Heart, MessageSquare, Bookmark, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PostActionsSidebarProps {
  votes: number;
  comments: number;
}

export function PostActionsSidebar({ votes, comments }: PostActionsSidebarProps) {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);
  const likeCount = liked ? votes + 1 : votes;

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <aside className="hidden lg:block w-16 shrink-0">
      <div className="sticky top-20 flex flex-col items-center gap-4">
        <button
          onClick={() => setLiked(!liked)}
          className={cn(
            "flex flex-col items-center gap-0.5",
            liked ? "text-primary" : "text-sub-foreground"
          )}
        >
          <Heart
            className="w-5 h-5"
            strokeWidth={1.5}
            fill={liked ? "currentColor" : "none"}
          />
          <span className="text-sm">{likeCount}</span>
        </button>
        <div className="w-full border-t border-border" />
        <button className="text-sub-foreground flex flex-col items-center gap-0.5">
          <MessageSquare className="w-5 h-5" strokeWidth={1.5} />
          <span className="text-sm">{comments}</span>
        </button>
        <button
          onClick={() => setBookmarked(!bookmarked)}
          className={bookmarked ? "text-primary" : "text-sub-foreground"}
        >
          <Bookmark
            className="w-5 h-5"
            strokeWidth={1.5}
            fill={bookmarked ? "currentColor" : "none"}
          />
        </button>
        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
          }}
          className={copied ? "text-primary" : "text-sub-foreground"}
        >
          <Share2 className="w-5 h-5" strokeWidth={1.5} />
        </button>
      </div>
    </aside>
  );
}
