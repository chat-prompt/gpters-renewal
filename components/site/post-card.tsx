import Link from "next/link";
import { MessageSquare, Bookmark, Share2 } from "lucide-react";
import { Vote } from "./vote";
import { UserMeta } from "./user-meta";

interface PostCardProps {
  slug: string;
  category: string;
  title: string;
  author: string;
  time: string;
  tags: string[];
  excerpt: string;
  votes: number;
  comments: number;
  thumbnail?: boolean;
}

export function PostCard({
  slug,
  category,
  title,
  author,
  time,
  tags,
  excerpt,
  votes,
  comments,
  thumbnail,
}: PostCardProps) {
  return (
    <div className="flex gap-4 p-4">
      <Vote initialCount={votes} />
      {thumbnail && (
        <div className="hidden md:block w-20 h-20 bg-muted rounded-md shrink-0" />
      )}
      <div className="flex-1 min-w-0 space-y-2">
        <Link href={`/posts/${slug}`} className="text-foreground font-medium hover:underline">
          {title}
        </Link>
        <p className="text-xs text-muted-foreground">
          <span className="text-primary font-medium">{category}</span> ·{" "}
          <UserMeta username={author} date={time} showAvatar={false} className="gap-0" />
        </p>
        <div className="flex gap-1 flex-wrap">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-sm"
            >
              #{tag}
            </span>
          ))}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{excerpt}</p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
          <span className="flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5" /> {comments}개 댓글
          </span>
          <span className="flex items-center gap-1">
            <Bookmark className="w-3.5 h-3.5" /> 북마크
          </span>
          <span className="flex items-center gap-1">
            <Share2 className="w-3.5 h-3.5" /> 공유
          </span>
        </div>
      </div>
    </div>
  );
}
