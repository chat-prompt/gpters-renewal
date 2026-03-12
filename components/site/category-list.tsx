"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
  name: string;
  slug: string;
  count: number;
  icon: LucideIcon;
}

interface CategoryListProps {
  categories: Category[];
  selected?: string;
  onChange?: (slug: string) => void;
}

export function CategoryList({
  categories,
  selected,
  onChange,
}: CategoryListProps) {
  return (
    <div className="border border-border rounded-lg">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">카테고리</h3>
        {selected && selected !== "전체" && (
          <button
            type="button"
            onClick={() => onChange?.("전체")}
            className="text-sm text-primary"
          >
            전체보기
          </button>
        )}
      </div>
      <div className="p-2">
        <button
          type="button"
          onClick={() => onChange?.("전체")}
          className={cn(
            "flex w-full items-center gap-3 px-3 py-2 rounded-md text-sm text-left",
            !selected || selected === "전체"
              ? "bg-accent text-primary font-medium"
              : "text-foreground"
          )}
        >
          <span className="flex-1">전체</span>
        </button>
        {categories.map((cat) => {
          const isSelected = selected === cat.name;
          return (
            <button
              key={cat.slug}
              type="button"
              onClick={() => onChange?.(cat.name)}
              className={cn(
                "flex w-full items-center gap-3 px-3 py-2 rounded-md text-sm text-left",
                isSelected
                  ? "bg-accent text-primary font-medium"
                  : "text-foreground"
              )}
            >
              <cat.icon
                className={cn(
                  "w-4 h-4 shrink-0",
                  isSelected ? "text-primary" : "text-sub-foreground"
                )}
                strokeWidth={1.5}
              />
              <span className="flex-1">{cat.name}</span>
              <span className="text-sm text-sub-foreground">{cat.count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
