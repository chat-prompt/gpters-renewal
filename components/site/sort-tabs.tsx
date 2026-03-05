"use client";

import { Flame, Clock } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface SortOption {
  label: string;
  value: string;
  icon: LucideIcon;
}

const defaultOptions: SortOption[] = [
  { label: "인기", value: "popular", icon: Flame },
  { label: "최신", value: "recent", icon: Clock },
];

interface SortTabsProps {
  options?: SortOption[];
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function SortTabs({
  options = defaultOptions,
  defaultValue,
  onChange,
  className,
}: SortTabsProps) {
  return (
    <Select
      defaultValue={defaultValue ?? options[0].value}
      onValueChange={onChange}
    >
      <SelectTrigger
        size="sm"
        className={cn(
          "w-auto border-none shadow-none bg-transparent px-0 text-muted-foreground hover:text-foreground focus-visible:ring-0",
          className
        )}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => {
          const Icon = opt.icon;
          return (
            <SelectItem key={opt.value} value={opt.value}>
              <Icon className="w-3.5 h-3.5" />
              {opt.label}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
