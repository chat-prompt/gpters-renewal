import Link from "next/link";
import { cn } from "@/lib/utils";

interface TagListProps {
  tags: string[];
  variant?: "hash" | "pill";
  linked?: boolean;
  className?: string;
}

export function TagList({ tags, variant = "hash", linked = true, className }: TagListProps) {
  if (tags.length === 0) return null;

  return (
    <div className={cn("flex gap-1 flex-wrap", className)}>
      {tags.map((tag) => {
        const baseClasses = cn(
          "text-sm",
          variant === "hash"
            ? "bg-muted text-secondary-foreground px-1.5 py-0.5 rounded hover:bg-accent transition-colors"
            : "px-2.5 py-0.5 rounded-full bg-accent text-primary border border-border hover:bg-primary hover:text-primary-foreground transition-colors"
        );

        const content = tag;

        if (linked) {
          return (
            <Link
              key={tag}
              href={`/tag/${encodeURIComponent(tag)}`}
              className={baseClasses}
            >
              {content}
            </Link>
          );
        }

        return (
          <span key={tag} className={baseClasses}>
            {content}
          </span>
        );
      })}
    </div>
  );
}
