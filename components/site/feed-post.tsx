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
    <div className="flex gap-3 px-4 py-3">
      <Vote initialCount={votes} />
      <div className="flex-1 min-w-0 space-y-1.5">
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
            <MessageSquare className="w-3.5 h-3.5" /> {comments}
          </span>
          <span className="flex items-center gap-1">
            <Share2 className="w-3.5 h-3.5" /> 공유
          </span>
        </div>
      </div>
    </div>
  );
}
