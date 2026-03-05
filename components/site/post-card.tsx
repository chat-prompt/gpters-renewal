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
    <article className="flex gap-6 py-6">
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">@{author}</span>
          {" · "}
          <span>{category}</span>
        </p>
        <Link href={`/posts/${slug}`} className="group space-y-1.5">
          <h3 className="text-lg font-bold text-foreground group-hover:underline line-clamp-2 leading-snug">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {excerpt}
          </p>
        </Link>
        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
          <span>{time}</span>
          <span className="flex items-center gap-1">
            <Heart className="w-3.5 h-3.5" /> {votes}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5" /> {comments}
          </span>
          <span className="flex items-center gap-1 ml-auto">
            <Bookmark className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
      {thumbnail && (
        <div className="hidden sm:block w-28 h-28 bg-muted rounded shrink-0" />
      )}
    </article>
  );
}
