import Link from "next/link";
import { Heart, MessageSquare, Bookmark } from "lucide-react";
import { TagList } from "@/components/site/tag-list";

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
  thumbnailUrl?: string;
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
  thumbnailUrl,
  showAuthor = true,
  seriesId,
  seriesTitle,
  positionInSeries,
}: PostCardProps) {
  return (
    <article className="py-6 flex flex-col gap-component">
      {/* Author · category/series · time */}
      {showAuthor && (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-muted shrink-0" />
          <span className="text-sm font-regular text-sub-foreground">
            <Link href={`/profile/${encodeURIComponent(author)}`} className="font-medium text-foreground hover:underline">{author}</Link>
            {seriesTitle && seriesId ? (
              <>
                {" · "}
                <Link href={`/series/${seriesId}`} className="text-primary hover:underline">
                  {seriesTitle} {positionInSeries}화
                </Link>
              </>
            ) : (
              <>
                {" · "}
                <span>{category}</span>
              </>
            )}
            {" · "}{time}
          </span>
        </div>
      )}

      {/* Category · time (when no author) */}
      {!showAuthor && (
        <div className="text-sm font-regular text-sub-foreground">
          <span className="font-medium text-foreground">{category}</span>
          {seriesTitle && seriesId && (
            <>
              {" · "}
              <Link href={`/series/${seriesId}`} className="text-primary hover:underline">
                {seriesTitle} {positionInSeries}화
              </Link>
            </>
          )}
          {" · "}{time}
        </div>
      )}

      {/* Title + Excerpt + Thumbnail — 썸네일은 이 영역에만 묶임 */}
      <div className="flex gap-5">
        <Link href={`/posts/${slug}`} className="group flex-1 min-w-0">
          <h3 className="text-xl font-semibold text-foreground group-hover:underline line-clamp-2 leading-snug">
            {title}
          </h3>
          <p className="text-base font-regular text-secondary-foreground line-clamp-2 leading-relaxed mt-component">
            {excerpt}
          </p>
        </Link>

        {thumbnailUrl && (
          <Link href={`/posts/${slug}`} className="hidden sm:block shrink-0 self-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={thumbnailUrl} alt="" className="w-[120px] h-[80px] object-cover rounded-md" />
          </Link>
        )}
      </div>

      {/* Meta — 태그 + 아이콘 */}
      <div className="flex items-center gap-3 text-sm font-regular text-sub-foreground">
        {tags.length > 0 && (
          <TagList tags={tags.slice(0, 2)} />
        )}
        <span className="ml-auto flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Heart className="w-5 h-5" strokeWidth={1.5} /> {votes}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="w-5 h-5" strokeWidth={1.5} /> {comments}
          </span>
          <button type="button" className="hover:text-foreground transition-colors cursor-pointer">
            <Bookmark className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </span>
      </div>
    </article>
  );
}
