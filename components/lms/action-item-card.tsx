import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface ActionItemCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
  className?: string;
}

export function ActionItemCard({
  icon,
  title,
  description,
  href,
  ctaLabel,
  className,
}: ActionItemCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border p-4 flex flex-col gap-3",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <span className="text-primary shrink-0">{icon}</span>
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">{title}</p>
          <p className="text-xs text-sub-foreground mt-0.5">{description}</p>
        </div>
      </div>
      <Link
        href={href}
        className="inline-flex items-center text-xs font-medium text-primary hover:text-primary/80 transition-colors"
      >
        {ctaLabel}
        <span className="ml-1">&rarr;</span>
      </Link>
    </div>
  );
}
