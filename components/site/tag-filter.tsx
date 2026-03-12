"use client";

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
  className,
}: TagFilterProps) {
  const handleToggle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className={cn("flex items-center gap-2 flex-wrap", className)}>
      {tags.map((tag) => {
        const isSelected = selected.includes(tag.id);
        return (
          <button
            key={tag.id}
            type="button"
            onClick={() => handleToggle(tag.id)}
            className={cn(
              "inline-flex items-center px-2.5 py-0.5 rounded-full text-sm transition-colors",
              isSelected
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-sub-foreground"
            )}
          >
            {tag.name}
          </button>
        );
      })}
    </div>
  );
}
