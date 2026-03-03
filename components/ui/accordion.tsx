"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionItem {
  key: string;
  title: string;
  children: ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
  defaultOpen?: string[];
}

export function Accordion({ items, className, defaultOpen = [] }: AccordionProps) {
  const [openKeys, setOpenKeys] = useState<Set<string>>(new Set(defaultOpen));

  const toggle = (key: string) => {
    setOpenKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div
      className={cn(
        "rounded-lg border border-border divide-y divide-border",
        className
      )}
    >
      {items.map((item) => {
        const isOpen = openKeys.has(item.key);
        return (
          <div key={item.key}>
            <button
              onClick={() => toggle(item.key)}
              className="w-full flex items-center justify-between p-4 text-sm text-foreground hover:bg-muted/50 transition-colors"
            >
              <span className="font-medium text-left">{item.title}</span>
              <ChevronDown
                className={cn(
                  "w-4 h-4 text-muted-foreground shrink-0 transition-transform",
                  isOpen && "rotate-180"
                )}
              />
            </button>
            {isOpen && (
              <div className="px-4 pb-4">{item.children}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
