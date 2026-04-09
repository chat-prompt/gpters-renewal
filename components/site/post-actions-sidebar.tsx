"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Heart, MessageSquare, Bookmark, Send, Link2, PenSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

interface PostActionsSidebarProps {
  votes: number;
  comments: number;
}

export function PostActionsSidebar({ votes, comments }: PostActionsSidebarProps) {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [liked, setLiked] = useState(false);

  const requireLogin = () => {
    if (!isLoggedIn) {
      router.push(`/login?from=${encodeURIComponent(pathname)}`);
      return true;
    }
    return false;
  };
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
          onClick={() => { if (requireLogin()) return; setLiked(!liked); }}
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
        <div className="text-sub-foreground flex flex-col items-center gap-0.5">
          <MessageSquare className="w-5 h-5" strokeWidth={1.5} />
          <span className="text-sm">{comments}</span>
        </div>
        <button
          onClick={() => { if (requireLogin()) return; setBookmarked(!bookmarked); }}
          className={bookmarked ? "text-primary" : "text-sub-foreground"}
        >
          <Bookmark
            className="w-5 h-5"
            strokeWidth={1.5}
            fill={bookmarked ? "currentColor" : "none"}
          />
        </button>
        {/* SNS Share */}
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => {
              const url = encodeURIComponent(window.location.href);
              window.open(`https://t.me/share/url?url=${url}`, "_blank", "width=600,height=400");
            }}
            className="text-sub-foreground hover:text-primary transition-colors"
            title="공유하기"
          >
            <Send className="w-5 h-5" strokeWidth={1.5} />
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setCopied(true);
            }}
            className={copied ? "text-primary" : "text-sub-foreground hover:text-primary transition-colors"}
            title="링크 복사"
          >
            <Link2 className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>
        <div className="w-full border-t border-border" />
        {/* Write */}
        <a
          href="/write?type=case"
          className="text-sub-foreground hover:text-primary transition-colors"
          title="글쓰기"
        >
          <PenSquare className="w-5 h-5" strokeWidth={1.5} />
        </a>
      </div>
    </aside>
  );
}
