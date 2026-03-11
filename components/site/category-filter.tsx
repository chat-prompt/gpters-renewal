"use client";

import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  categories: { id: string; name: string; count?: number }[];
  selected: string;
  onChange: (id: string) => void;
  className?: string;
}

export function CategoryFilter({
  categories,
  selected,
  onChange,
  className,
}: CategoryFilterProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={cn(
            "px-3 py-1.5 text-sm rounded-full transition-colors",
            selected === cat.id
              ? "bg-foreground text-background font-medium"
              : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
          )}
        >
          {cat.name}
          {cat.count != null && ` (${cat.count})`}
        </button>
      ))}
    </div>
  );
}
