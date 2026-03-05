import Link from "next/link";
import { Heart, MessageSquare, Bookmark } from "lucide-react";

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
    <div className="flex gap-4 px-4 py-4">
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <p className="text-xs text-muted-foreground">
          <span className="text-primary font-medium">{category}</span>
          {" · "}
          <span>@{author}</span>
          {" · "}
          <span>{time}</span>
        </p>
        <div className="space-y-1">
          <Link
            href={`/posts/${slug}`}
            className="text-foreground font-medium hover:underline line-clamp-1"
          >
            {title}
          </Link>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {excerpt}
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Heart className="w-3.5 h-3.5" /> {votes}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5" /> {comments}
          </span>
          <span className="flex items-center gap-1">
            <Bookmark className="w-3.5 h-3.5" /> 저장
          </span>
        </div>
      </div>
      {thumbnail && (
        <div className="hidden sm:block w-20 h-20 bg-muted rounded shrink-0" />
      )}
    </div>
  );
}
