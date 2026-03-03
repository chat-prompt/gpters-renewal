"use client";

import { MessageSquare, Bookmark, Share2 } from "lucide-react";
import { Vote } from "./vote";

interface PostActionsSidebarProps {
  votes: number;
  comments: number;
}

export function PostActionsSidebar({ votes, comments }: PostActionsSidebarProps) {
  return (
    <aside className="hidden lg:block w-16 shrink-0">
      <div className="sticky top-20 flex flex-col items-center gap-4">
        <Vote initialCount={votes} />
        <div className="w-full border-t border-border" />
        <button className="text-muted-foreground flex flex-col items-center gap-0.5">
          <MessageSquare className="w-5 h-5" />
          <span className="text-xs">{comments}</span>
        </button>
        <button className="text-muted-foreground">
          <Bookmark className="w-5 h-5" />
        </button>
        <button className="text-muted-foreground">
          <Share2 className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
}
