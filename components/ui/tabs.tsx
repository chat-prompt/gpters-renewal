"use client";

import { cn } from "@/lib/utils";

interface TabItem {
  key: string;
  label: string;
  count?: number;
}

interface TabsProps {
  items: TabItem[];
  activeKey: string;
  onTabChange: (key: string) => void;
  className?: string;
}

export function Tabs({ items, activeKey, onTabChange, className }: TabsProps) {
  return (
    <div
      className={cn(
        "flex gap-1 border-b border-border overflow-x-auto",
        className
      )}
    >
      {items.map((item) => (
        <button
          key={item.key}
          onClick={() => onTabChange(item.key)}
          className={cn(
            "px-4 py-2 text-sm whitespace-nowrap border-b-2 transition-colors",
            activeKey === item.key
              ? "border-primary text-foreground font-medium"
              : "border-transparent text-sub-foreground hover:text-foreground"
          )}
        >
          {item.label}
          {item.count !== undefined && (
            <span className="ml-1 text-sm text-sub-foreground">
              ({item.count})
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
