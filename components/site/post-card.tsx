import Link from "next/link";
import { MessageSquare, Bookmark } from "lucide-react";
import { Vote } from "./vote";

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
    <div className="flex gap-3 px-4 py-3">
      <Vote initialCount={votes} />
      <div className="flex-1 min-w-0 space-y-1">
        <p className="text-xs text-muted-foreground">
          <span className="text-primary font-medium">{category}</span>
          {" · "}
          <span>@{author}</span>
          {" · "}
          <span>{time}</span>
        </p>
        <Link href={`/posts/${slug}`} className="text-sm text-foreground font-medium hover:underline line-clamp-1">
          {title}
        </Link>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5" /> {comments}
          </span>
          <span className="flex items-center gap-1">
            <Bookmark className="w-3.5 h-3.5" /> 저장
          </span>
        </div>
      </div>
      {thumbnail && (
        <div className="hidden sm:block w-16 h-16 bg-muted rounded shrink-0" />
      )}
    </div>
  );
}
