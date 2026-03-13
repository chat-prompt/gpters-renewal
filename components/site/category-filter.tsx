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
    <div className={cn("flex gap-2 overflow-x-auto scrollbar-hide", className)}>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={cn(
            "whitespace-nowrap shrink-0 px-3.5 py-2 text-sm rounded-lg transition-colors",
            selected === cat.id
              ? "bg-primary text-primary-foreground font-medium"
              : "bg-muted text-sub-foreground hover:bg-accent hover:text-foreground"
          )}
        >
          {cat.name}
          {cat.count != null && ` (${cat.count})`}
        </button>
      ))}
    </div>
  );
}
