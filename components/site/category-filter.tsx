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
    <div className={cn("flex gap-1 border-b border-border overflow-x-auto", className)}>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={cn(
            "px-4 py-2.5 text-sm whitespace-nowrap border-b-2",
            selected === cat.id
              ? "border-primary text-primary font-medium"
              : "border-transparent text-muted-foreground"
          )}
        >
          {cat.name}
          {cat.count != null && ` (${cat.count})`}
        </button>
      ))}
    </div>
  );
}
