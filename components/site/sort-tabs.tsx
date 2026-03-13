"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface SortOption {
  label: string;
  value: string;
}

const defaultOptions: SortOption[] = [
  { label: "최신", value: "recent" },
  { label: "인기", value: "popular" },
];

interface SortTabsProps {
  options?: SortOption[];
  /** Controlled value */
  value?: string;
  /** Uncontrolled default value */
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function SortTabs({
  options = defaultOptions,
  value,
  defaultValue,
  onChange,
  className,
}: SortTabsProps) {
  const [internal, setInternal] = useState(
    defaultValue ?? options[0].value
  );
  const selected = value ?? internal;

  function handleClick(v: string) {
    if (value === undefined) setInternal(v);
    onChange?.(v);
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {options.map((opt, i) => (
        <span key={opt.value} className="flex items-center gap-2">
          {i > 0 && <span className="text-border">|</span>}
          <button
            type="button"
            onClick={() => handleClick(opt.value)}
            className={cn(
              "text-sm transition-colors",
              selected === opt.value
                ? "font-medium text-primary"
                : "text-sub-foreground hover:text-foreground"
            )}
          >
            {opt.label}
          </button>
        </span>
      ))}
    </div>
  );
}
