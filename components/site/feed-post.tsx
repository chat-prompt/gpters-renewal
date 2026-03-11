import Link from "next/link";
import { Heart, MessageSquare, Share2 } from "lucide-react";
import { UserMeta } from "./user-meta";

interface FeedPostProps {
  id: string;
  author: string;
  username: string;
  time: string;
  content: string;
  hasImage?: boolean;
  tags: string[];
  votes: number;
  comments: number;
}

export function FeedPost({
  id,
  author,
  username,
  time,
  content,
  hasImage,
  tags,
  votes,
  comments,
}: FeedPostProps) {
  return (
    <Link href={`/community/${id}`} className="block px-4 py-3 hover:bg-muted/50 transition-colors">
      <div className="space-y-1.5">
        <UserMeta name={author} username={username} date={time} size="sm" />
        <p className="text-sm text-foreground leading-relaxed line-clamp-3">{content}</p>
        {hasImage && <div className="h-40 bg-muted rounded" />}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {tags.length > 0 && (
            <span className="text-primary">
              {tags.map((t) => `#${t}`).join(" ")}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Heart className="w-3.5 h-3.5" /> {votes}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5" /> {comments}
          </span>
          <span className="flex items-center gap-1">
            <Share2 className="w-3.5 h-3.5" /> 공유
          </span>
        </div>
      </div>
    </Link>
  );
}
