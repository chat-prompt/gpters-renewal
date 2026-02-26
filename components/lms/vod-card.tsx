import { Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface VodCardProps {
  title: string;
  studyName: string;
  week: number;
  duration: string;
  watched: boolean;
  className?: string;
}

export function VodCard({
  title,
  studyName,
  week,
  duration,
  watched,
  className,
}: VodCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-background overflow-hidden",
        className
      )}
    >
      <div className="aspect-video bg-muted flex items-center justify-center relative">
        <Play className="w-8 h-8 text-muted-foreground" />
        {watched && (
          <Badge variant="active" className="absolute top-2 right-2">
            시청 완료
          </Badge>
        )}
      </div>
      <div className="p-3 space-y-1">
        <p className="text-sm font-medium text-foreground line-clamp-1">{title}</p>
        <p className="text-xs text-muted-foreground">
          {studyName} &middot; {week}주차 &middot; {duration}
        </p>
      </div>
    </div>
  );
}
