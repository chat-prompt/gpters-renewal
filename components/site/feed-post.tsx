import Link from "next/link";
import { MessageSquare, Share2 } from "lucide-react";
import { Vote } from "./vote";
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
    <div className="flex gap-3 p-4">
      <Vote initialCount={votes} />
      <div className="flex-1 min-w-0 space-y-2">
        <UserMeta name={author} username={username} date={time} size="sm" />
        <p className="text-sm text-foreground leading-relaxed">{content}</p>
        {hasImage && <div className="h-48 bg-muted rounded-md" />}
        {tags.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {tags.map((tag) => (
              <Link
                key={tag}
                href="#"
                className="text-xs text-primary bg-accent px-2 py-0.5 rounded-sm"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
          <span className="flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5" /> {comments}개 댓글
          </span>
          <span className="flex items-center gap-1">
            <Share2 className="w-3.5 h-3.5" /> 공유
          </span>
        </div>
      </div>
    </div>
  );
}
