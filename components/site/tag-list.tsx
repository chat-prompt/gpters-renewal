import { cn } from "@/lib/utils";

interface TagListProps {
  tags: string[];
  variant?: "hash" | "pill";
  className?: string;
}

export function TagList({ tags, variant = "hash", className }: TagListProps) {
  if (tags.length === 0) return null;

  return (
    <div className={cn("flex gap-1 flex-wrap", className)}>
      {tags.map((tag) => (
        <span
          key={tag}
          className={cn(
            "text-xs",
            variant === "hash"
              ? "bg-muted text-muted-foreground px-2 py-0.5 rounded-sm"
              : "px-2.5 py-0.5 rounded-full bg-accent text-primary border border-border"
          )}
        >
          {variant === "hash" ? `#${tag}` : tag}
        </span>
      ))}
    </div>
  );
}
