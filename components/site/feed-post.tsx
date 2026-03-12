import Link from "next/link";
import { Heart, MessageSquare, Bookmark } from "lucide-react";

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
    <article className="py-6 flex flex-col gap-component">
      {/* Author · time */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-muted shrink-0" />
        <span className="text-sm text-sub-foreground">
          <Link
            href={`/profile/${encodeURIComponent(author)}`}
            className="font-medium text-foreground hover:underline"
          >
            {author}
          </Link>
          {" · "}{time}
        </span>
      </div>

      {/* Content + Image */}
      <Link href={`/community/${id}`} className="group block space-y-3">
        <p className="text-secondary-foreground leading-relaxed line-clamp-3">
          {content}
        </p>
        {hasImage && <div className="h-40 bg-muted rounded" />}
      </Link>

      {/* Meta — 태그 + 아이콘 */}
      <div className="flex items-center gap-3 text-sm text-sub-foreground">
        {tags.length > 0 && (
          <div className="flex items-center gap-1.5">
            {tags.slice(0, 2).map((tag) => (
              <Link
                key={tag}
                href={`/tag/${encodeURIComponent(tag)}`}
                className="px-1.5 py-0.5 rounded bg-muted hover:bg-accent transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}
        <span className="ml-auto flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Heart className="w-5 h-5" strokeWidth={1.5} /> {votes}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="w-5 h-5" strokeWidth={1.5} /> {comments}
          </span>
          <button
            type="button"
            className="hover:text-foreground transition-colors cursor-pointer"
          >
            <Bookmark className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </span>
      </div>
    </article>
  );
}
