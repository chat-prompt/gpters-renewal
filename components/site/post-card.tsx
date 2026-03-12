import Link from "next/link";
import { Heart, MessageSquare, Bookmark, MoreHorizontal } from "lucide-react";

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
  showAuthor?: boolean;
  seriesId?: string;
  seriesTitle?: string;
  positionInSeries?: number;
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
  showAuthor = true,
  seriesId,
  seriesTitle,
  positionInSeries,
}: PostCardProps) {
  return (
    <article className="flex gap-8 py-8">
      <div className="flex-1 min-w-0 flex flex-col gap-3">
        {/* Author */}
        {showAuthor && (
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-muted shrink-0" />
            <span className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{author}</span>
              {" in "}
              <span className="font-medium text-foreground">{category}</span>
              {seriesTitle && seriesId && (
                <>
                  {" · "}
                  <Link href={`/series/${seriesId}`} className="text-primary hover:underline">
                    {seriesTitle} {positionInSeries}화
                  </Link>
                </>
              )}
            </span>
          </div>
        )}

        {/* Title + Excerpt */}
        <Link href={`/posts/${slug}`} className="group space-y-2">
          <h3 className="text-xl font-extrabold text-foreground group-hover:underline line-clamp-2 leading-snug">
            {title}
          </h3>
          <p className="text-base text-muted-foreground line-clamp-2 leading-relaxed">
            {excerpt}
          </p>
        </Link>

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
          <span>{time}</span>
          {tags.length > 0 && tags.slice(0, 2).map((tag) => (
            <Link key={tag} href={`/tag/${encodeURIComponent(tag)}`} className="text-primary hover:underline">
              #{tag}
            </Link>
          ))}
          <span className="flex items-center gap-1">
            <Heart className="w-3.5 h-3.5" /> {votes}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5" /> {comments}
          </span>
          <div className="flex items-center gap-3 ml-auto">
            <Bookmark className="w-3.5 h-3.5" />
            <MoreHorizontal className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {thumbnail && (
        <div className="hidden sm:block w-28 h-20 bg-muted rounded shrink-0 self-center" />
      )}
    </article>
  );
}
