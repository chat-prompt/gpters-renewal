import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface QuickActionItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface QuickActionProps {
  items: QuickActionItem[];
}

export function QuickAction({ items }: QuickActionProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-border rounded-md text-foreground hover:bg-muted transition-colors whitespace-nowrap"
        >
          <item.icon className="w-4 h-4" />
          {item.label}
        </Link>
      ))}
    </div>
  );
}
