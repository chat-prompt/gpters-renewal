"use client";

import { useState } from "react";
import { Flame, Clock, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface SortOption {
  label: string;
  value: string;
  icon: LucideIcon;
}

const defaultOptions: SortOption[] = [
  { label: "인기", value: "popular", icon: Flame },
  { label: "최신", value: "recent", icon: Clock },
  { label: "추천", value: "recommended", icon: TrendingUp },
];

interface SortTabsProps {
  options?: SortOption[];
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export function SortTabs({
  options = defaultOptions,
  defaultValue,
  onChange,
}: SortTabsProps) {
  const [active, setActive] = useState(defaultValue ?? options[0].value);

  const handleClick = (value: string) => {
    setActive(value);
    onChange?.(value);
  };

  return (
    <div className="flex items-center gap-1 border-b border-border">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => handleClick(opt.value)}
          className={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            active === opt.value
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground"
          }`}
        >
          <opt.icon className="w-4 h-4" />
          {opt.label}
        </button>
      ))}
    </div>
  );
}
