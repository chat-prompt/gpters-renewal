import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserMeta } from "./user-meta";

interface PostResultData {
  category: string;
  title: string;
  author: string;
  time: string;
  excerpt: string;
  votes: number;
  href: string;
}

interface StudyResultData {
  title: string;
  description: string;
  status: string;
  href: string;
}

type SearchResultRowProps =
  | { type: "post"; data: PostResultData; className?: string }
  | { type: "study"; data: StudyResultData; className?: string };

export function SearchResultRow(props: SearchResultRowProps) {
  const { type, className } = props;

  if (type === "post") {
    const { data } = props;
    return (
      <Link href={data.href} className={cn("block p-4", className)}>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-primary font-medium">
              {data.category}
            </span>
            <span className="text-sm font-medium text-foreground">
              {data.title}
            </span>
          </div>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <ArrowUp className="w-3 h-3" />
            {data.votes}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mb-1">
          <UserMeta username={data.author} date={data.time} showAvatar={false} className="gap-0" />
        </p>
        <p className="text-sm text-muted-foreground">{data.excerpt}</p>
      </Link>
    );
  }

  const { data } = props;
  return (
    <Link
      href={data.href}
      className={cn("flex items-center justify-between p-4", className)}
    >
      <div>
        <p className="text-sm font-medium text-foreground">{data.title}</p>
        <p className="text-xs text-muted-foreground">{data.description}</p>
      </div>
      <span
        className={cn(
          "text-xs px-2 py-0.5 rounded-sm",
          data.status === "모집중"
            ? "bg-primary/10 text-primary"
            : "bg-muted text-muted-foreground"
        )}
      >
        {data.status}
      </span>
    </Link>
  );
}
