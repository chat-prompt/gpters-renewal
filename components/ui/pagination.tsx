"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-1">
      <button
        onClick={() => onPageChange?.(currentPage - 1)}
        disabled={currentPage <= 1}
        className="w-8 h-8 flex items-center justify-center rounded-md text-sub-foreground disabled:opacity-50"
      >
        <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
      </button>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange?.(page)}
          className={cn(
            "w-8 h-8 text-sm rounded-md transition-colors",
            page === currentPage
              ? "bg-foreground text-background"
              : "text-sub-foreground hover:bg-muted"
          )}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange?.(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="w-8 h-8 flex items-center justify-center rounded-md text-sub-foreground disabled:opacity-50"
      >
        <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
      </button>
    </div>
  );
}
