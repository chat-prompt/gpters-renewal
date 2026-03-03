import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  viewAllLabel?: string;
  onViewAll?: () => void;
  className?: string;
}

export function SectionHeader({
  title,
  viewAllLabel = "전체보기",
  onViewAll,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <h2 className="text-sm font-bold text-foreground">{title}</h2>
      {onViewAll && (
        <button
          onClick={onViewAll}
          className="text-xs text-muted-foreground flex items-center gap-1"
        >
          {viewAllLabel} <ChevronRight className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}
