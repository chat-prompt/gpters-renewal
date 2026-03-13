import { Lock } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface VodLockCardProps {
  title: string;
  studyName: string;
  week: number;
  duration: string;
  className?: string;
}

export function VodLockCard({
  title,
  studyName,
  week,
  duration,
  className,
}: VodLockCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border overflow-hidden opacity-70",
        className
      )}
    >
      <div className="aspect-video bg-muted flex flex-col items-center justify-center gap-2 relative">
        <Lock className="w-6 h-6 text-sub-foreground" />
        <p className="text-xs text-sub-foreground text-center px-4">
          과제를 작성하면 열립니다
        </p>
      </div>
      <div className="p-3 space-y-1">
        <p className="text-sm font-medium text-foreground line-clamp-1">{title}</p>
        <p className="text-xs font-regular text-sub-foreground">
          {studyName} &middot; {week}주차 &middot; {duration}
        </p>
        <Link
          href="/write?type=case"
          className="inline-flex text-xs text-primary font-medium hover:text-primary/80 transition-colors mt-1"
        >
          글쓰기 &rarr;
        </Link>
      </div>
    </div>
  );
}
