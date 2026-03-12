import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface PostAuthorMetaProps {
  author: {
    name: string;
    avatar?: string;
    href: string;
  };
  date: string;
  viewCount: number;
  className?: string;
}

export function PostAuthorMeta({
  author,
  date,
  viewCount,
  className,
}: PostAuthorMetaProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 text-sm text-sub-foreground",
        className
      )}
    >
      <Avatar size="sm" />
      <Link href={author.href} className="text-foreground font-medium">
        {author.name}
      </Link>
      <span>{date}</span>
      <span>조회 {viewCount.toLocaleString()}</span>
    </div>
  );
}
