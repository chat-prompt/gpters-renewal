"use client";

import { useState } from "react";
import { Heart, MessageSquare, Bookmark, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PostActionsSidebarProps {
  votes: number;
  comments: number;
}

export function PostActionsSidebar({ votes, comments }: PostActionsSidebarProps) {
  const [liked, setLiked] = useState(false);
  const likeCount = liked ? votes + 1 : votes;

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
        <button className="text-sub-foreground">
          <Bookmark className="w-5 h-5" strokeWidth={1.5} />
        </button>
        <button className="text-sub-foreground">
          <Share2 className="w-5 h-5" strokeWidth={1.5} />
        </button>
      </div>
    </aside>
  );
}
