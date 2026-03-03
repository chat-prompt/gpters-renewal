"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagFilterProps {
  tags: { id: string; name: string }[];
  selected: string[];
  onChange: (ids: string[]) => void;
  variant?: "pill" | "hash";
  className?: string;
}

export function TagFilter({
  tags,
  selected,
  onChange,
  variant = "hash",
  className,
}: TagFilterProps) {
  const selectedTags = tags.filter((tag) => selected.includes(tag.id));

  const handleRemove = (id: string) => {
    onChange(selected.filter((s) => s !== id));
  };

  return (
    <div className={cn("flex items-center gap-2 flex-wrap", className)}>
      <span className="text-xs text-muted-foreground">태그:</span>
      {selectedTags.map((tag) => (
        <span
          key={tag.id}
          className={cn(
            "inline-flex items-center gap-1 text-xs",
            variant === "hash"
              ? "px-2 py-0.5 bg-accent text-accent-foreground rounded-sm"
              : "px-2.5 py-0.5 rounded-full bg-accent text-primary border border-border"
          )}
        >
          {variant === "hash" ? `#${tag.name}` : tag.name}
          <button onClick={() => handleRemove(tag.id)}>
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
    </div>
  );
}
