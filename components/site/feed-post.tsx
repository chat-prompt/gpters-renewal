"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, MessageSquare, Bookmark } from "lucide-react";

interface FeedPostProps {
  id: string;
  author: string;
  username: string;
  time: string;
  content: string;
  imageUrl?: string;
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
  imageUrl,
  tags,
  votes,
  comments,
}: FeedPostProps) {
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <article className="py-6 flex flex-col gap-component">
      {/* Author · time */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-muted shrink-0" />
        <span className="text-sm font-regular text-sub-foreground">
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
        <p className="font-regular text-secondary-foreground leading-relaxed line-clamp-3">
          {content}
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {imageUrl && <img src={imageUrl} alt="" className="h-40 w-full object-cover rounded" />}
      </Link>

      {/* Meta — 태그 + 아이콘 */}
      <div className="flex items-center gap-3 text-sm font-regular text-sub-foreground">
        {tags.length > 0 && (
          <div className="flex items-center gap-1.5">
            {tags.slice(0, 2).map((tag) => (
              <Link
                key={tag}
                href={`/tag/${encodeURIComponent(tag)}`}
                className="px-1.5 py-0.5 rounded bg-muted text-secondary-foreground hover:bg-accent transition-colors"
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
            onClick={() => setBookmarked(!bookmarked)}
            className={`hover:text-foreground transition-colors cursor-pointer ${bookmarked ? "text-primary" : ""}`}
          >
            <Bookmark
              className="w-5 h-5"
              strokeWidth={1.5}
              fill={bookmarked ? "currentColor" : "none"}
            />
          </button>
        </span>
      </div>
    </article>
  );
}
